import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import { FCMProvider } from '../providers/fcm.provider';

interface UsersGrpcService {
    GetDeviceTokens(data: { employeeCode: string }): any;
}

interface DeviceTokensResponse {
    deviceTokens?: string[];
    tokens?: string[];
}

@Injectable()
export class NotificationService implements OnModuleInit {
    private usersGrpcService: UsersGrpcService;

    constructor(
        @Inject('USERS_PACKAGE') private readonly usersClient: ClientGrpc,
        private readonly fcmProvider: FCMProvider,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(NotificationService.name);
    }

    onModuleInit() {
        this.usersGrpcService = this.usersClient.getService<UsersGrpcService>('UsersService');
    }

    async sendAttendanceNotification(event: any): Promise<void> {
        const { employeeCode, time, deviceName } = event;

        this.logger.info('NotificationService#sendAttendanceNotification.call', { employeeCode });

        if (!employeeCode) {
            this.logger.warn('NotificationService#sendAttendanceNotification.missingEmployeeCode');
            return;
        }

        try {
            // 1. Get device tokens from users-svc with timeout
            console.error('=== BEFORE gRPC CALL ===', { employeeCode });

            const GRPC_TIMEOUT_MS = 10000; // 10 seconds timeout
            
            const response = await Promise.race([
                firstValueFrom(
                    this.usersGrpcService.GetDeviceTokens({ employeeCode })
                ),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('gRPC timeout: GetDeviceTokens exceeded 10s')), GRPC_TIMEOUT_MS)
                )
            ]) as any;

            console.error('=== AFTER gRPC CALL ===');
            console.error('Response type:', typeof response);
            console.error('Response:', JSON.stringify(response, null, 2));
            console.error('Response keys:', Object.keys(response || {}));
            console.error('response.tokens:', response?.tokens);
            console.error('response.deviceTokens:', response?.deviceTokens);

            const tokens = response?.tokens || response?.deviceTokens || [];
            console.error('Final tokens array:', tokens);
            console.error('Tokens length:', tokens?.length);

            if (!tokens || tokens.length === 0) {
                console.error('=== NO TOKENS FOUND ===');
                this.logger.info('NotificationService#sendAttendanceNotification.noTokensFound', { employeeCode });
                return;
            }

            this.logger.info('NotificationService#sendAttendanceNotification.tokensFound', { count: tokens.length });

            // 2. Prepare notification content
            const eventType = event.type || 'IN';
            const eventTypeLabel = this.getEventTypeLabel(eventType);
            const eventIcon = this.getEventTypeIcon(eventType);

            const title = `${eventIcon} ${eventTypeLabel}`;

            // Format time: "HH:mm - dd/MM/yyyy"
            const timeDate = new Date(time);
            const timeFormatted = timeDate.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const dateFormatted = timeDate.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            const body = `Bạn đã chấm công lúc ${timeFormatted} ngày ${dateFormatted} tại ${deviceName || 'máy chấm công'}.`;

            const data = {
                type: 'ATTENDANCE_CREATED',
                attendanceId: event.id ? String(event.id) : '',
                recordId: event.id ? String(event.id) : '', // Added ID of ATT_RECORDS
                eventType: eventType,
                time: String(time),
                deviceName: deviceName || '',
            };

            // 3. Send notification
            await this.fcmProvider.sendToDevices(tokens, title, body, data);
            
            this.logger.info('NotificationService#sendAttendanceNotification.success', { employeeCode });

        } catch (error) {
            this.logger.error({
                err: error,
                employeeCode,
                message: error.message,
                stack: error.stack
            }, 'NotificationService#sendAttendanceNotification.error');
            
            // Re-throw error để listener có thể catch và retry
            throw error;
        }
    }

    private getEventTypeLabel(eventType: string): string {
        const labels: { [key: string]: string } = {
            'IN': 'Bạn đã chấm công thành công',
            'OUT': 'Bạn đã chấm công thành công',
            'BREAK_START': 'Bạn đã bắt đầu nghỉ thành công',
            'BREAK_END': 'Bạn đã kết thúc nghỉ thành công',
        };
        return labels[eventType] || 'Chấm công thành công';
    }

    private getEventTypeIcon(eventType: string): string {
        const icons: { [key: string]: string } = {
            'IN': '✅',
            'OUT': '👋',
            'BREAK_START': '☕',
            'BREAK_END': '💼',
        };
        return icons[eventType] || '📋';
    }
}
