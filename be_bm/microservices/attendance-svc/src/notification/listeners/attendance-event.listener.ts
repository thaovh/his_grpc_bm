import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import { NotificationService } from '../services/notification.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AttendanceEventListener {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly redisService: RedisService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(AttendanceEventListener.name);
    }

    @OnEvent('attendance.created')
    async handleAttendanceCreatedEvent(payload: any) {
        this.logger.info('AttendanceEventListener#handleAttendanceCreatedEvent.call', {
            employeeCode: payload.employeeCode
        });

        try {
            await this.notificationService.sendAttendanceNotification(payload);
            this.logger.info('AttendanceEventListener#handleAttendanceCreatedEvent.success', {
                employeeCode: payload.employeeCode
            });
        } catch (error) {
            this.logger.error({
                err: error,
                payload,
                message: error.message,
                stack: error.stack
            }, 'AttendanceEventListener#handleAttendanceCreatedEvent.error');

            // Push to notification retry queue instead of silently failing
            try {
                await this.redisService.pushNotificationRetry({
                    payload,
                    retryCount: 0,
                    lastAttempt: new Date().toISOString(),
                    error: {
                        message: error.message,
                        stack: error.stack,
                    }
                });
                this.logger.info('AttendanceEventListener#handleAttendanceCreatedEvent.pushedToRetryQueue', {
                    employeeCode: payload.employeeCode
                });
            } catch (retryError) {
                this.logger.error({
                    err: retryError,
                    payload,
                }, 'AttendanceEventListener#handleAttendanceCreatedEvent.failedToPushRetryQueue');
            }
        }
    }
}
