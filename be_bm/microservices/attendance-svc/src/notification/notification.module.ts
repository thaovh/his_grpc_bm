import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { FCMProvider } from './providers/fcm.provider';
import { NotificationService } from './services/notification.service';
import { NotificationRetryService } from './services/notification-retry.service';
import { AttendanceEventListener } from './listeners/attendance-event.listener';
import { RedisModule } from '../redis/redis.module';

@Module({
    imports: [
        ConfigModule,
        RedisModule,
        ClientsModule.registerAsync([
            {
                name: 'USERS_PACKAGE',
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'users',
                        protoPath: join(__dirname, '../_proto/users.proto'),
                        url: configService.get('USERS_GRPC_URL') || 'localhost:50051',
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    providers: [
        FCMProvider, 
        NotificationService, 
        NotificationRetryService,
        AttendanceEventListener
    ],
    exports: [NotificationService],
})
export class NotificationModule { }
