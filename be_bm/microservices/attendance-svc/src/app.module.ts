import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PollingModule } from './polling/polling.module';
import { ProcessorModule } from './processor/processor.module';
import { AttendanceController } from './attendance.controller';
import { NotificationModule } from './notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        safe: true,
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
                file: './logs/attendance-svc-error.log',
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
                file: './logs/attendance-svc-combined.log',
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
    RedisModule,
    AttendanceModule,
    ProcessorModule,
    PollingModule,
    NotificationModule,
  ],
  controllers: [AppController, AttendanceController],
  providers: [AppService],
})
export class AppModule { }
