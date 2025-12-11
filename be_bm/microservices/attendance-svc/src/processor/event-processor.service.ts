import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { AttendanceService } from '../attendance/services/attendance.service';

@Injectable()
export class EventProcessorService implements OnModuleInit {
    private readonly logger = new Logger(EventProcessorService.name);
    private isProcessing = false;
    private readonly MAX_RETRIES = 3;
    private readonly workerCount: number;

    constructor(
        private readonly redisService: RedisService,
        private readonly attendanceService: AttendanceService,
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2,
    ) {
        console.log('!!! DEBUG: EventProcessorService CONSTRUCTOR called !!!');
        this.workerCount = this.configService.get<number>('WORKER_COUNT', 5);
    }

    onModuleInit() {
        console.log('!!! DEBUG: EventProcessorService initialized !!!');
        this.logger.log(`Event Processor initialized. Starting ${this.workerCount} background workers...`);
        this.startProcessing();
    }

    private async startProcessing() {
        this.isProcessing = true;

        // Start multiple workers
        const workers = [];
        for (let i = 0; i < this.workerCount; i++) {
            workers.push(this.startWorker(i));
        }

        // Wait for all workers (they run indefinitely)
        await Promise.all(workers);
    }

    private async startWorker(workerId: number) {
        this.logger.log(`Worker #${workerId} started`);

        while (this.isProcessing) {
            try {
                const event = await this.redisService.popEvent();

                if (event) {
                    this.logger.debug(`Worker #${workerId} processing event`);
                    await this.processEventWithRetry(event, 0, workerId);
                }
            } catch (error) {
                this.logger.error(`Worker #${workerId} error processing event from Redis`, error);
                // Wait a bit before retrying to avoid tight loop on persistent errors
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        this.logger.log(`Worker #${workerId} stopped`);
    }

    private async processEventWithRetry(event: any, retryCount: number = 0, workerId?: number) {
        try {
            await this.processEvent(event, workerId);
        } catch (error) {
            const workerLabel = workerId !== undefined ? `Worker #${workerId}: ` : '';
            this.logger.error(`${workerLabel}Failed to process event (attempt ${retryCount + 1}/${this.MAX_RETRIES})`, error);

            if (retryCount < this.MAX_RETRIES) {
                // Exponential backoff: 1s, 2s, 4s
                const delay = Math.pow(2, retryCount) * 1000;
                this.logger.log(`${workerLabel}Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.processEventWithRetry(event, retryCount + 1, workerId);
            } else {
                // Max retries exceeded → Push to DLQ
                this.logger.error(`${workerLabel}Max retries exceeded for event. Moving to DLQ.`);
                await this.redisService.pushToDeadLetterQueue(event, error, retryCount);
            }
        }
    }

    private async processEvent(event: any, workerId?: number) {
        // Parse event body (could be in event.body or directly in event)
        let eventData = event.body || event;

        // If event_log is a JSON string, parse it
        if (eventData.event_log && typeof eventData.event_log === 'string') {
            try {
                const parsedLog = JSON.parse(eventData.event_log);
                eventData = { ...eventData, ...parsedLog };
            } catch (e) {
                this.logger.warn('Failed to parse event_log JSON');
            }
        }

        // Extract AccessControllerEvent if present
        if (eventData.AccessControllerEvent) {
            eventData = { ...eventData, ...eventData.AccessControllerEvent };
        }

        // Try to extract employee code (might be in different fields)
        const employeeCode = eventData.employeeNoString ||
            eventData.employeeCode ||
            eventData.cardNo ||
            eventData.userID ||
            eventData.employeeNo;

        // ⚠️ VALIDATION: Skip events without employee information (don't retry)
        if (!employeeCode || employeeCode === 'UNKNOWN') {
            this.logger.warn(`Skipping event without employee information. Event type: ${eventData.eventType}. RAW DATA: ${JSON.stringify(eventData)}`);
            return; // Don't throw error - just skip
        }

        // Device ID from headers or body
        const deviceId = event.headers?.['device-id'] ||
            eventData.deviceId ||
            eventData.ipAddress ||
            eventData.macAddress ||
            'UNKNOWN';

        // Device Name from event data (set by polling service)
        const deviceName = eventData.deviceName || deviceId;

        // Event type mapping (ISAPI uses different event types)
        const eventType = this.mapEventType(eventData.eventType || eventData.type);

        // Timestamp - try multiple fields (ISAPI uses "time" field)
        let eventTimestamp: Date;
        if (eventData.time) {
            // ISAPI event timestamp format: "2026-01-05T06:42:05+07:00"
            eventTimestamp = new Date(eventData.time);
        } else if (eventData.dateTime) {
            eventTimestamp = new Date(eventData.dateTime);
        } else if (eventData.timestamp) {
            eventTimestamp = new Date(eventData.timestamp);
        } else {
            // Fallback to current time if no timestamp found (should not happen for ISAPI events)
            this.logger.warn(`No timestamp found in event data, using current time. Event keys: ${Object.keys(eventData).join(', ')}`);
            eventTimestamp = new Date(event.timestamp || Date.now());
        }
        
        // Log timestamp for debugging
        this.logger.debug(`Event timestamp parsed: ${eventTimestamp.toISOString()} from field: ${eventData.time ? 'time' : eventData.dateTime ? 'dateTime' : eventData.timestamp ? 'timestamp' : 'fallback'}`);

        // Image URL (if provided)
        const imageUrl = eventData.imageUrl || eventData.picUrl;

        // Store raw data for debugging
        const rawData = JSON.stringify(event);

        // DEBUG: Force output to console
        console.error('---------------------------------------------------');
        console.error('RAW EVENT DATA KEYS:', Object.keys(eventData));
        console.error('RAW EVENT DATA:', JSON.stringify(eventData, null, 2));
        console.error('---------------------------------------------------');

        const workerLabel = workerId !== undefined ? `[Worker #${workerId}] ` : '';
        this.logger.log(`${workerLabel}Processing valid attendance event for employee: ${employeeCode}`);

        // Create attendance record via CQRS (this will throw if fails)
        const record = await this.attendanceService.create({
            employeeCode,
            deviceId,
            eventType,
            eventTimestamp,
            imageUrl,
            rawData,
        });

        this.logger.log(`${workerLabel}Successfully created attendance record: ${record.id} for employee: ${employeeCode}`);

        // Emit event for notification
        this.eventEmitter.emit('attendance.created', {
            id: record.id,
            employeeCode,
            time: eventTimestamp,
            deviceName: deviceName, // Use deviceName from event data (set by polling service)
            type: record.eventType,
        });
    }

    private mapEventType(type: string): string {
        // Map ISAPI event types to our internal types
        const typeMap: { [key: string]: string } = {
            'checkIn': 'IN',
            'checkOut': 'OUT',
            'breakStart': 'BREAK_START',
            'breakEnd': 'BREAK_END',
            'AccessControllerEvent': 'IN', // Default ISAPI event
        };

        return typeMap[type] || 'IN'; // Default to IN if unknown
    }

    stopProcessing() {
        this.logger.log('Stopping event processor...');
        this.isProcessing = false;
    }
}
