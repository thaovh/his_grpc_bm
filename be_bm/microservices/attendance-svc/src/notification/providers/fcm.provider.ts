import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class FCMProvider implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(FCMProvider.name);
    }

    onModuleInit() {
        this.initializeFirebase();
    }

    private initializeFirebase() {
        const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
        const privateKeyPath = this.configService.get<string>('FIREBASE_PRIVATE_KEY_PATH');

        if (!projectId || !privateKeyPath) {
            this.logger.warn('Firebase configuration missing. Push notifications will be disabled.');
            return;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const serviceAccount = require(privateKeyPath);

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });

            this.logger.info('Firebase Admin initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize Firebase Admin', error);
        }
    }

    async sendToDevice(token: string, title: string, body: string, data?: any): Promise<void> {
        try {
            if (!admin.apps.length) {
                this.logger.warn('Firebase not initialized. Skipping notification.');
                return;
            }


            console.log('--- FCM PAYLOAD DEBUG (Single) ---');
            console.log('Token:', token);
            console.log('Title:', title);
            console.log('Body:', body);
            console.log('Data:', data);
            console.log('----------------------------------');

            await admin.messaging().send({
                token,
                notification: {
                    title,
                    body,
                },
                data: data ? this.serializeData(data) : undefined,
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'bachmaistaff_notification_channel_id',
                        defaultSound: true,
                        defaultVibrateTimings: true,
                    },
                },
                apns: {
                    headers: {
                        'apns-priority': '10',
                    },
                    payload: {
                        aps: {
                            contentAvailable: true,
                            sound: 'default',
                        },
                    },
                },
            });

            this.logger.info('Notification sent successfully', { token: this.truncateToken(token) });
        } catch (error) {
            this.logger.error('Failed to send notification', { error: error.message, token: this.truncateToken(token) });
            // Don't throw error to prevent disrupting the flow
        }
    }

    async sendToDevices(tokens: string[], title: string, body: string, data?: any): Promise<void> {
        if (!tokens.length) return;

        try {
            if (!admin.apps.length) {
                this.logger.warn('Firebase not initialized. Skipping notification.');
                return;
            }


            console.log('--- FCM PAYLOAD DEBUG (Multicast) ---');
            console.log('Tokens:', tokens);
            console.log('Title:', title);
            console.log('Body:', body);
            console.log('Data:', data);
            console.log('-------------------------------------');

            const response = await admin.messaging().sendEachForMulticast({
                tokens,
                notification: {
                    title,
                    body,
                },
                data: data ? this.serializeData(data) : undefined,
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'bachmaistaff_notification_channel_id',
                        defaultSound: true,
                        defaultVibrateTimings: true,
                    },
                },
                apns: {
                    headers: {
                        'apns-priority': '10',
                    },
                    payload: {
                        aps: {
                            contentAvailable: true,
                            sound: 'default',
                        },
                    },
                },
            });

            this.logger.info('Multicast notification sent', {
                successCount: response.successCount,
                failureCount: response.failureCount,
            });

            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(this.truncateToken(tokens[idx]));
                    }
                });
                this.logger.warn('Failed to send to some devices', { failedTokens });
            }
        } catch (error) {
            this.logger.error('Failed to send multicast notification', error);
        }
    }

    private serializeData(data: any): Record<string, string> {
        const result: Record<string, string> = {};
        for (const key in data) {
            if (typeof data[key] === 'object') {
                result[key] = JSON.stringify(data[key]);
            } else {
                result[key] = String(data[key]);
            }
        }
        return result;
    }

    private truncateToken(token: string): string {
        return token && token.length > 10 ? `${token.substring(0, 10)}...` : token;
    }
}
