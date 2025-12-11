import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { MachineManagementModule } from './machine-management';
import { UserContextInterceptor } from './commons/interceptors/user-context.interceptor';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        LoggerModule.forRoot({
            pinoHttp: {
                transport: {
                    targets: [
                        {
                            target: 'pino-pretty',
                            options: {
                                singleLine: true,
                                colorize: true,
                                translateTime: 'SYS:standard',
                            },
                        },
                        {
                            target: 'pino-roll',
                            level: 'error',
                            options: {
                                file: './logs/machine-svc-error.log',
                                frequency: 'daily',
                                mkdir: true,
                                dateFormat: 'yyyy-MM-dd',
                                limit: {
                                    count: 14,
                                },
                            },
                        },
                        {
                            target: 'pino-roll',
                            level: 'info',
                            options: {
                                file: './logs/machine-svc-combined.log',
                                frequency: 'daily',
                                mkdir: true,
                                dateFormat: 'yyyy-MM-dd',
                                limit: {
                                    count: 14,
                                },
                            },
                        },
                    ],
                },
            } as any,
        }),
        DatabaseModule,
        MachineManagementModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: UserContextInterceptor,
        },
    ],
})
export class AppModule { }
