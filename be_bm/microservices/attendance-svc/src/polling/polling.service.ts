import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PollingConfig } from './entities/polling-config.entity';
import { IsapiClientService } from './isapi-client.service';
import { RedisService } from '../redis/redis.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class PollingService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PollingService.name);
    private readonly intervals: Map<string, NodeJS.Timeout> = new Map();
    private readonly isPolling: Map<string, boolean> = new Map();

    constructor(
        @InjectRepository(PollingConfig)
        private readonly configRepo: Repository<PollingConfig>,
        private readonly dataSource: DataSource,
        private readonly isapiClient: IsapiClientService,
        private readonly redisService: RedisService,
        private readonly schedulerRegistry: SchedulerRegistry,
    ) { }

    async onModuleInit() {
        this.logger.log('Initializing PollingService...');
        await this.loadAndStartWorkers();
    }

    onModuleDestroy() {
        this.stopAllWorkers();
    }

    async loadAndStartWorkers() {
        const configs = await this.configRepo.find({ where: { isActive: 1 } });
        this.logger.log(`Found ${configs.length} active configurations.`);

        for (const config of configs) {
            this.startWorker(config);
        }
    }

    startWorker(config: PollingConfig) {
        if (this.intervals.has(config.id.toString())) {
            this.logger.warn(`Worker for ${config.name} (${config.ipAddress}) already running.`);
            return;
        }

        this.logger.log(`Starting worker for ${config.name} (${config.ipAddress}) with interval ${config.pollInterval}s`);

        const intervalMs = (config.pollInterval || 60) * 1000;
        // Pass config.id instead of config object to force reload from DB each time
        const intervalId = setInterval(() => this.pollMachine(config.id), intervalMs);

        this.intervals.set(config.id.toString(), intervalId as any);
    }

    stopAllWorkers() {
        this.intervals.forEach((interval) => clearInterval(interval));
        this.intervals.clear();
    }

    private async pollMachine(configId: string) {
        if (this.isPolling.get(configId)) {
            this.logger.debug(`Skipping poll for ${configId}: Previous poll still running`);
            return;
        }

        this.isPolling.set(configId, true);

        try {
            // CRITICAL: Reload config from DB to get fresh lastPollTime value
            // Use raw query with transaction isolation to ensure we get the latest committed value
            // Set isolation level to READ COMMITTED to bypass any uncommitted transactions
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            let rawResult: any[];
            try {
                // Set transaction isolation level to READ COMMITTED
                await queryRunner.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
                
                // Read LAST_POLL_TIME as string with timezone to preserve original value
                // Use TO_CHAR to get the exact timestamp string with timezone from Oracle
                rawResult = await queryRunner.query(
                    `SELECT /*+ NO_RESULT_CACHE */ 
                        ID, NAME, 
                        TO_CHAR(LAST_POLL_TIME, 'YYYY-MM-DD"T"HH24:MI:SS.FF6TZH:TZM') AS LAST_POLL_TIME_STR,
                        LAST_POLL_TIME,
                        IS_ACTIVE, POLL_INTERVAL, IP_ADDRESS, PORT, USERNAME, PASSWORD 
                     FROM ATT_POLLING_CONFIG 
                     WHERE ID = :id`,
                    [configId]
                );
            } finally {
                await queryRunner.release();
            }
            
            if (!rawResult || rawResult.length === 0) {
                this.logger.error(`Config ${configId} not found, stopping worker`);
                this.stopWorker(configId);
                return;
            }

            const rawConfig = rawResult[0];
            
            if (rawConfig.IS_ACTIVE !== 1) {
                this.stopWorker(configId);
                return;
            }

            // Log raw value from Oracle DB with more details
            const rawTimeValue = rawConfig.LAST_POLL_TIME;
            const rawTimeStr = rawConfig.LAST_POLL_TIME_STR; // String representation with timezone
            this.logger.log(`[${rawConfig.NAME}] Raw LAST_POLL_TIME from Oracle DB (Date object): ${rawTimeValue}, type: ${typeof rawTimeValue}`);
            this.logger.log(`[${rawConfig.NAME}] Raw LAST_POLL_TIME from Oracle DB (String with TZ): ${rawTimeStr}`);

            const now = new Date();
            // Parse timestamp from Oracle - prefer string representation to preserve timezone
            let startTime: Date;
            if (rawConfig.LAST_POLL_TIME) {
                // Try to parse from string first to preserve timezone, then fallback to Date object
                if (rawTimeStr) {
                    // Parse string like "2026-01-04T23:59:59.000000+07:00"
                    // Convert to ISO format that JavaScript Date can parse
                    const isoStr = rawTimeStr.replace(/(\d{2}):(\d{2})$/, '$1$2'); // Remove colon from timezone offset
                    startTime = new Date(isoStr);
                    this.logger.log(`[${rawConfig.NAME}] Parsed LAST_POLL_TIME from string: ${startTime.toISOString()}, getTime: ${startTime.getTime()}`);
                } else {
                    // Fallback to Date object parsing
                    const dbTime = rawConfig.LAST_POLL_TIME instanceof Date 
                        ? rawConfig.LAST_POLL_TIME 
                        : new Date(rawConfig.LAST_POLL_TIME);
                    this.logger.log(`[${rawConfig.NAME}] Parsed LAST_POLL_TIME from Date object: ${dbTime.toISOString()}, getTime: ${dbTime.getTime()}`);
                    startTime = dbTime;
                }
            } else {
                startTime = new Date(now.getTime() - 10 * 60 * 1000);
            }
            
            // Create config object for compatibility with PollingConfig interface
            // Only fields needed for searchEvents: ipAddress, port, username, password, name
            const config = {
                id: rawConfig.ID,
                name: rawConfig.NAME,
                ipAddress: rawConfig.IP_ADDRESS,
                port: rawConfig.PORT,
                username: rawConfig.USERNAME,
                password: rawConfig.PASSWORD,
                pollInterval: rawConfig.POLL_INTERVAL,
                isActive: rawConfig.IS_ACTIVE,
                lastPollTime: startTime, // Use parsed time
                createdAt: new Date(), // Dummy values for TypeScript compatibility
                updatedAt: new Date(),
                version: 1,
            } as PollingConfig;

            // Cap endTime to now
            const endTime = now;

            // Log current lastPollTime from DB for debugging
            if (config.lastPollTime) {
                const dbTime = new Date(config.lastPollTime);
                this.logger.log(`[${config.name}] Current LAST_POLL_TIME from DB: ${dbTime.toISOString()} (${dbTime.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} VN)`);
            } else {
                this.logger.log(`[${config.name}] Current LAST_POLL_TIME from DB: NULL (will use 10 minutes ago)`);
            }
            this.logger.log(`[${config.name}] Will fetch events from: ${startTime.toISOString()} to ${endTime.toISOString()}`);
            this.logger.log(`[${config.name}] Time range: ${((endTime.getTime() - startTime.getTime()) / 1000 / 60).toFixed(2)} minutes`);

            if (startTime >= endTime) {
                this.logger.debug(`Skipping poll for ${config.name}: startTime >= endTime`);
                return;
            }

            this.logger.debug(`Polling ${config.name} (${config.ipAddress}) from ${startTime.toISOString()} to ${endTime.toISOString()}`);

            try {
                let allEvents = [];
                let searchResultPosition = 0;
                let batchCount = 0;
                const MAX_BATCHES = 1000; // Safety limit to prevent infinite loop (allows ~100,000 events with maxResults=100)
                const EXPECTED_BATCH_SIZE = 30; // Actual max events returned by machine API (despite maxResults: 100)

                // Use consistent searchID for pagination within same time window
                const searchID = `${config.id}-${startTime.getTime()}-${endTime.getTime()}`;

                // Loop to fetch all events in batches using searchResultPosition for pagination
                while (batchCount < MAX_BATCHES) {
                    batchCount++;

                    const result = await this.isapiClient.searchEvents(config, startTime, endTime, searchResultPosition, searchID);

                    if (!result.events || result.events.length === 0) {
                        this.logger.debug(`[${config.name}] Batch ${batchCount}: No more events`);
                        break;
                    }

                    this.logger.log(`[${config.name}] Batch ${batchCount}: Fetched ${result.events.length} events (hasMore: ${result.hasMore}, position: ${searchResultPosition})`);
                    allEvents = allEvents.concat(result.events);

                    // Update searchResultPosition for next batch (ISAPI pagination)
                    searchResultPosition += result.events.length;

                    // If API says no more events, stop
                    if (!result.hasMore) {
                        this.logger.debug(`[${config.name}] Batch ${batchCount}: API indicates no more events (responseStatusStrg != 'MORE')`);
                        break;
                    }

                    // Add small delay between batches to prevent overwhelming the machine
                    // and avoid authentication failures
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                this.logger.log(`[${config.name}] Total: Fetched ${allEvents.length} events in ${batchCount} batches`);

                if (allEvents && allEvents.length > 0) {
                    // Sort all events by timestamp to ensure chronological order
                    const sortedEvents = allEvents.sort((a, b) => {
                        const timeA = new Date(a.time).getTime();
                        const timeB = new Date(b.time).getTime();
                        return timeA - timeB;
                    });

                    // Process ALL events and track successfully processed events
                    let processedCount = 0;
                    let skippedCount = 0;
                    let failedCount = 0;
                    const successfullyProcessedEvents: any[] = [];

                    for (const event of sortedEvents) {
                        // Skip events without employee information
                        if (!event.employeeNoString || event.employeeNoString === 'UNKNOWN' || event.employeeNoString.trim() === '') {
                            skippedCount++;
                            this.logger.debug(`[${config.name}] Skipping event without employeeNoString: ${JSON.stringify(event)}`);
                            continue;
                        }

                        try {
                            // Enrich event with device info if needed
                            const enrichedEvent = {
                                ...event,
                                deviceId: config.id, // Use config ID as device ID reference
                                deviceName: config.name, // Use config name as device name
                                deviceIp: config.ipAddress,
                                pollTime: now,
                            };
                            
                            // Push to Redis - if this fails, don't count as processed
                            await this.redisService.pushEvent(enrichedEvent);
                            
                            // Only add to successfullyProcessedEvents if push succeeded
                            successfullyProcessedEvents.push(event);
                            processedCount++;
                        } catch (pushError) {
                            failedCount++;
                            this.logger.error(`[${config.name}] Failed to push event to Redis`, {
                                eventTime: event.time,
                                employeeCode: event.employeeNoString,
                                error: pushError.message
                            });
                            // Don't add to successfullyProcessedEvents - will retry in next poll
                        }
                    }

                    this.logger.log(`[${config.name}] Processed ${processedCount} events, skipped ${skippedCount} events without employee info, failed ${failedCount} events`);

                    // Update lastPollTime only based on successfully processed events
                    if (successfullyProcessedEvents.length > 0) {
                        // Use timestamp of the last successfully processed event
                        const lastProcessedEvent = successfullyProcessedEvents[successfullyProcessedEvents.length - 1];

                        // Parse event time and add 5 seconds to ensure we advance past this event
                        const lastEventTimeStr = lastProcessedEvent.time; // e.g., "2026-01-05T06:13:54+07:00"
                        const lastEventTime = new Date(lastEventTimeStr);
                        lastEventTime.setSeconds(lastEventTime.getSeconds() + 5); // Add 5 seconds

                        this.logger.log(`[${config.name}] Last successfully processed event: ${lastEventTimeStr}`);

                        // CRITICAL: Only update if event timestamp is NEWER than current lastPollTime
                        // This prevents regression when fetching old events
                        const currentLastPollTime = config.lastPollTime ? new Date(config.lastPollTime) : new Date(0);

                        if (lastEventTime > currentLastPollTime) {
                            this.logger.log(`[${config.name}] Saving lastPollTime: ${lastEventTime.toISOString()} (+5s, newer than current)`);
                            config.lastPollTime = lastEventTime;
                        } else {
                            this.logger.log(`[${config.name}] Event timestamp ${lastEventTime.toISOString()} is older than current ${currentLastPollTime.toISOString()}`);
                            this.logger.log(`[${config.name}] Saving lastPollTime: ${endTime.toISOString()} (using endTime to advance)`);
                            config.lastPollTime = endTime;
                        }
                    } else {
                        // No events successfully processed - don't update lastPollTime to allow retry
                        if (failedCount > 0) {
                            this.logger.warn(`[${config.name}] ${failedCount} events failed to push to Redis. Not updating lastPollTime to allow retry.`);
                            // Don't update lastPollTime so we retry this window next time
                            return; // Exit early without saving
                        } else {
                            // No events found in this time window (all skipped), advance to endTime
                            this.logger.log(`[${config.name}] No events found, advancing lastPollTime to endTime: ${endTime.toISOString()}`);
                            config.lastPollTime = endTime;
                        }
                    }

                    const savedConfig = await this.configRepo.save(config);
                    this.logger.log(`[${config.name}] Successfully saved. DB value: ${savedConfig.lastPollTime}`);
                } else {
                    // No events found in this time window, advance to endTime
                    this.logger.log(`[${config.name}] No events found, advancing lastPollTime to endTime: ${endTime.toISOString()}`);
                    config.lastPollTime = endTime;
                    const savedConfig = await this.configRepo.save(config);
                    this.logger.log(`[${config.name}] Successfully saved. DB value: ${savedConfig.lastPollTime}`);
                }
            } catch (error) {
                this.logger.error(`Error polling ${configId}: ${error.message}`, error.stack);
                // Do not update lastPollTime so we retry this window next time
            }
        } catch (error) {
            this.logger.error(`Outer error polling ${configId}: ${error.message}`, error.stack);
        } finally {
            this.isPolling.set(configId, false);
        }
    }

    stopWorker(id: string) {
        const interval = this.intervals.get(id);
        if (interval) {
            clearInterval(interval);
            this.intervals.delete(id);
            this.logger.log(`Stopped worker ${id}`);
        }
    }
}
