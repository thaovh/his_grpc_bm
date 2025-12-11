import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { RedisService } from '../../redis/redis.service';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationRetryService implements OnModuleInit {
    private isProcessing = false;
    // Exponential backoff delays: 5s, 15s, 60s
    private readonly RETRY_DELAYS = [5000, 15000, 60000];

    constructor(
        private readonly redisService: RedisService,
        private readonly notificationService: NotificationService,
        private readonly configService: ConfigService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(NotificationRetryService.name);
    }

    onModuleInit() {
        this.logger.info('NotificationRetryService initialized. Starting retry processor...');
        this.startRetryProcessor();
    }

    private async startRetryProcessor() {
        this.isProcessing = true;

        while (this.isProcessing) {
            try {
                const retryItem = await this.redisService.popNotificationRetry();

                if (retryItem) {
                    await this.processRetry(retryItem);
                }
            } catch (error) {
                this.logger.error({
                    err: error,
                    message: error.message,
                    stack: error.stack
                }, 'Error in notification retry processor');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }

    private async processRetry(retryItem: any) {
        const { payload, retryCount, lastAttempt } = retryItem;
        
        // Get delay based on retry count (exponential backoff)
        const delay = this.RETRY_DELAYS[retryCount] || 60000; // Default to 60s if retryCount exceeds array

        this.logger.info({
            employeeCode: payload?.employeeCode,
            retryCount,
            delayMs: delay,
            lastAttempt
        }, `Processing notification retry (attempt ${retryCount + 1})`);

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, delay));

        try {
            await this.notificationService.sendAttendanceNotification(payload);
            this.logger.info({
                employeeCode: payload?.employeeCode,
                retryCount: retryCount + 1
            }, 'Notification retry successful');
        } catch (error) {
            this.logger.error({
                err: error,
                employeeCode: payload?.employeeCode,
                retryCount: retryCount + 1,
                message: error.message
            }, 'Notification retry failed');

            // Push back to retry queue with incremented count
            await this.redisService.pushNotificationRetry({
                payload,
                retryCount: retryCount + 1,
                lastAttempt: new Date().toISOString(),
                error: {
                    message: error.message,
                    stack: error.stack,
                }
            });
        }
    }

    stopProcessing() {
        this.isProcessing = false;
        this.logger.info('NotificationRetryService stopped');
    }
}

