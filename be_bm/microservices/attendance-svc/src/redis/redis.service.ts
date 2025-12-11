import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private client: Redis;
    private popClient: Redis; // Dedicated client for blocking operations
    private readonly QUEUE_KEY = 'attendance:events:queue';

    constructor(private readonly configService: ConfigService) {
        const redisConfig = {
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
            password: this.configService.get<string>('REDIS_PASSWORD'),
            db: this.configService.get<number>('REDIS_DB', 0),
        };

        this.client = new Redis(redisConfig);
        this.popClient = new Redis(redisConfig); // Duplicate connection

        this.client.on('connect', () => {
            this.logger.log(`Client successfully connected to Redis at ${redisConfig.host}:${redisConfig.port}`);
        });

        this.client.on('error', (err) => {
            this.logger.error('Redis client connection error', err);
        });

        this.popClient.on('connect', () => {
            this.logger.log(`PopClient successfully connected to Redis for blocking ops`);
        });

        this.popClient.on('error', (err) => {
            this.logger.error('Redis PopClient connection error', err);
        });
    }

    onModuleInit() {
        // Connection is already established in constructor
    }

    onModuleDestroy() {
        this.client.disconnect();
        this.popClient.disconnect();
    }

    async pushEvent(event: any): Promise<number> {
        try {
            const payload = JSON.stringify(event);
            const length = await this.client.lpush(this.QUEUE_KEY, payload);

            // TTL: 5 minutes for testing
            await this.client.expire(this.QUEUE_KEY, 300);

            this.logger.debug(`Pushed event to queue. Queue length: ${length}`);
            return length;
        } catch (error) {
            this.logger.error('Failed to push event to Redis', error);
            throw error;
        }
    }

    async popEvent(): Promise<any> {
        try {
            // Use popClient for blocking operation
            const result = await this.popClient.brpop(this.QUEUE_KEY, 0);
            if (result && result[1]) {
                return JSON.parse(result[1]);
            }
            return null;
        } catch (error) {
            this.logger.error('Failed to pop event from Redis', error);
            // If connection fails, wait a bit to avoid tight loop in worker
            await new Promise(resolve => setTimeout(resolve, 1000));
            return null;
        }
    }

    // Dead Letter Queue methods use main client (non-blocking)
    async pushToDeadLetterQueue(event: any, error: any, retryCount: number): Promise<void> {
        try {
            const dlqItem = {
                originalEvent: event,
                error: {
                    message: error.message,
                    stack: error.stack,
                    code: error.code || 'UNKNOWN_ERROR',
                    name: error.name,
                },
                metadata: {
                    failedAt: new Date().toISOString(),
                    retryCount,
                    processorVersion: '1.0.0',
                },
            };

            await this.client.lpush('attendance:events:dlq', JSON.stringify(dlqItem));
            this.logger.error(`Event pushed to DLQ after ${retryCount} retries: ${error.message}`);
        } catch (err) {
            this.logger.error('Failed to push to DLQ', err);
        }
    }

    async getDLQLength(): Promise<number> {
        try {
            return await this.client.llen('attendance:events:dlq');
        } catch (error) {
            this.logger.error('Failed to get DLQ length', error);
            return 0;
        }
    }

    async peekDLQ(count: number = 10): Promise<any[]> {
        try {
            const items = await this.client.lrange('attendance:events:dlq', 0, count - 1);
            return items.map(item => JSON.parse(item));
        } catch (error) {
            this.logger.error('Failed to peek DLQ', error);
            return [];
        }
    }

    async retryFromDLQ(index: number): Promise<boolean> {
        try {
            const item = await this.client.lindex('attendance:events:dlq', index);
            if (item) {
                const dlqItem = JSON.parse(item);
                await this.pushEvent(dlqItem.originalEvent);
                await this.client.lrem('attendance:events:dlq', 1, item);
                this.logger.log(`Event moved from DLQ back to main queue (index: ${index})`);
                return true;
            }
            return false;
        } catch (error) {
            this.logger.error('Failed to retry from DLQ', error);
            return false;
        }
    }

    async clearDLQ(): Promise<number> {
        try {
            const length = await this.getDLQLength();
            await this.client.del('attendance:events:dlq');
            this.logger.log(`Cleared DLQ (${length} items removed)`);
            return length;
        } catch (error) {
            this.logger.error('Failed to clear DLQ', error);
            return 0;
        }
    }

    getClient(): Redis {
        return this.client;
    }

    // Notification Retry Queue methods
    private readonly NOTIFICATION_RETRY_QUEUE = 'attendance:notifications:retry';
    private readonly NOTIFICATION_DLQ = 'attendance:notifications:dlq';
    private readonly NOTIFICATION_MAX_RETRIES = 3;

    async pushNotificationRetry(notificationItem: {
        payload: any;
        retryCount: number;
        lastAttempt: string;
        error?: any;
    }): Promise<void> {
        try {
            if (notificationItem.retryCount >= this.NOTIFICATION_MAX_RETRIES) {
                // Move to DLQ after max retries
                await this.pushToNotificationDLQ(notificationItem);
                return;
            }

            const item = JSON.stringify(notificationItem);
            await this.client.lpush(this.NOTIFICATION_RETRY_QUEUE, item);
            await this.client.expire(this.NOTIFICATION_RETRY_QUEUE, 86400); // 24 hours TTL
            
            this.logger.warn(`Notification pushed to retry queue (attempt ${notificationItem.retryCount + 1}/${this.NOTIFICATION_MAX_RETRIES})`, {
                employeeCode: notificationItem.payload?.employeeCode
            });
        } catch (error) {
            this.logger.error('Failed to push notification to retry queue', error);
        }
    }

    async popNotificationRetry(): Promise<any> {
        try {
            const result = await this.popClient.brpop(this.NOTIFICATION_RETRY_QUEUE, 5); // 5s timeout
            if (result && result[1]) {
                return JSON.parse(result[1]);
            }
            return null;
        } catch (error) {
            this.logger.error('Failed to pop notification from retry queue', error);
            return null;
        }
    }

    async pushToNotificationDLQ(item: any): Promise<void> {
        try {
            const dlqItem = {
                ...item,
                failedAt: new Date().toISOString(),
                finalFailure: true,
            };
            await this.client.lpush(this.NOTIFICATION_DLQ, JSON.stringify(dlqItem));
            await this.client.expire(this.NOTIFICATION_DLQ, 86400 * 7); // 7 days TTL
            this.logger.error(`Notification moved to DLQ after ${item.retryCount} retries`, {
                employeeCode: item.payload?.employeeCode
            });
        } catch (error) {
            this.logger.error('Failed to push notification to DLQ', error);
        }
    }

    getNotificationRetryQueueLength(): Promise<number> {
        return this.client.llen(this.NOTIFICATION_RETRY_QUEUE);
    }

    getNotificationDLQLength(): Promise<number> {
        return this.client.llen(this.NOTIFICATION_DLQ);
    }
}
