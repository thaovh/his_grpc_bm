import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { PinoLogger } from 'nestjs-pino';

export interface StreamEvent {
    id: string; // Redis Stream ID format: timestamp-sequence (e.g., "1736832000000-0")
    type: string;
    data: any;
    timestamp: number;
}

export interface PublishEventInput {
    type: string;
    data: any;
}

@Injectable()
export class RedisStreamService implements OnModuleInit {
    private redis: Redis;
    private readonly streamName = 'events:all';
    private readonly maxLen = 20000;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(RedisStreamService.name);
    }

    async onModuleInit() {
        // Initialize Redis connection
        const redisHost = this.configService.get('REDIS_HOST') || 'localhost';
        const redisPort = this.configService.get('REDIS_PORT') || 6379;
        const redisPassword = this.configService.get('REDIS_PASSWORD');

        this.redis = new Redis({
            host: redisHost,
            port: redisPort,
            password: redisPassword,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        });

        this.redis.on('error', (err) => {
            this.logger.error('Redis connection error', { error: err.message });
        });

        this.redis.on('connect', () => {
            this.logger.info('Redis connected for stream service');
        });
    }

    /**
     * Parse Redis Stream ID to extract timestamp and sequence
     * Format: "1736832000000-0"
     */
    parseEventId(eventId: string): { timestamp: number; sequence: number } {
        const [timestampStr, sequenceStr] = eventId.split('-');
        return {
            timestamp: parseInt(timestampStr, 10),
            sequence: parseInt(sequenceStr, 10),
        };
    }

    /**
     * Publish event to Redis Stream
     * Returns the Redis-generated Stream ID (timestamp-sequence format)
     */
    async publish(input: PublishEventInput): Promise<string> {
        try {
            const timestamp = Date.now();

            // Publish to Redis Stream with MAXLEN ~20000
            // Redis will auto-generate ID in format: timestamp-sequence
            const streamId = await this.redis.xadd(
                this.streamName,
                'MAXLEN',
                '~', // Approximate trim for better performance
                this.maxLen.toString(),
                '*', // Auto-generate Stream ID
                'type',
                input.type,
                'timestamp',
                timestamp.toString(),
                'payload',
                JSON.stringify(input.data),
            );

            this.logger.debug('Event published to Redis Stream', {
                streamId,
                type: input.type,
                streamName: this.streamName,
            });

            return streamId;
        } catch (error) {
            this.logger.error('Failed to publish event to Redis Stream', {
                error: error.message,
                type: input.type,
            });
            throw error;
        }
    }

    /**
     * Read events from Redis Stream starting from a specific event ID
     * Used for event replay when client reconnects with Last-Event-ID
     */
    async readFrom(lastEventId: string, count: number = 100): Promise<StreamEvent[]> {
        try {
            // Read events starting AFTER the lastEventId
            const results = await this.redis.xrange(
                this.streamName,
                `(${lastEventId}`, // Exclusive start (events after lastEventId)
                '+', // To end
                'COUNT',
                count,
            );

            const events: StreamEvent[] = [];

            for (const [streamId, fields] of results) {
                events.push(this.parseStreamEntry(streamId, fields));
            }

            this.logger.debug('Events read from Redis Stream', {
                lastEventId,
                count: events.length,
            });

            return events;
        } catch (error) {
            this.logger.error('Failed to read events from Redis Stream', {
                error: error.message,
                lastEventId,
            });
            return [];
        }
    }

    /**
     * Read new events from Redis Stream (blocking)
     * Used for real-time event streaming
     */
    async readNew(blockMs: number = 5000, count: number = 100): Promise<StreamEvent[]> {
        try {
            // XREAD with BLOCK for real-time streaming
            // Use call() to bypass TypeScript type checking issues
            const results: any = await this.redis.call(
                'XREAD',
                'BLOCK',
                blockMs,
                'COUNT',
                count,
                'STREAMS',
                this.streamName,
                '$', // Only new messages
            );

            if (!results || results.length === 0) {
                return [];
            }

            const events: StreamEvent[] = [];
            const [, entries] = results[0];

            for (const [streamId, fields] of entries) {
                events.push(this.parseStreamEntry(streamId, fields));
            }

            return events;
        } catch (error) {
            this.logger.error('Failed to read new events from Redis Stream', {
                error: error.message,
            });
            return [];
        }
    }

    /**
     * Get stream info (length, first/last entry)
     */
    async getStreamInfo(): Promise<{
        length: number;
        firstEntry: string | null;
        lastEntry: string | null;
    }> {
        try {
            const length = await this.redis.xlen(this.streamName);

            let firstEntry = null;
            let lastEntry = null;

            if (length > 0) {
                const first = await this.redis.xrange(this.streamName, '-', '+', 'COUNT', 1);
                const last = await this.redis.xrevrange(this.streamName, '+', '-', 'COUNT', 1);

                if (first.length > 0) {
                    firstEntry = first[0][0]; // Use Stream ID directly
                }

                if (last.length > 0) {
                    lastEntry = last[0][0]; // Use Stream ID directly
                }
            }

            return { length, firstEntry, lastEntry };
        } catch (error) {
            this.logger.error('Failed to get stream info', { error: error.message });
            return { length: 0, firstEntry: null, lastEntry: null };
        }
    }

    /**
     * Parse Redis Stream entry fields to StreamEvent
     */
    private parseStreamEntry(streamId: string, fields: string[]): StreamEvent {
        const fieldMap: Record<string, string> = {};

        for (let i = 0; i < fields.length; i += 2) {
            fieldMap[fields[i]] = fields[i + 1];
        }

        return {
            id: streamId, // Use Redis Stream ID directly
            type: fieldMap.type,
            timestamp: parseInt(fieldMap.timestamp, 10),
            data: JSON.parse(fieldMap.payload),
        };
    }

    /**
     * Check if Redis is connected
     */
    isConnected(): boolean {
        return this.redis.status === 'ready';
    }

    /**
     * Cleanup on module destroy
     */
    async onModuleDestroy() {
        await this.redis.quit();
    }
}
