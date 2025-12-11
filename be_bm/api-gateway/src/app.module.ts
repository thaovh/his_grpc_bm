import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { HealthCheckModule } from './health-check/health-check.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { MasterDataModule } from './master-data/master-data.module';
import { IntegrationModule } from './integration/integration.module';
import { EventsModule } from './events/events.module';
import { MachineModule } from './machine/machine.module';
import { UploadModule } from './upload/upload.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AttendanceModule } from './attendance/attendance.module';
import { GatewayConfigModule } from './gateway-config/gateway-config.module';
import { NavigationModule } from './navigation/navigation.module';
import appConfig from './config/app.config';
import grpcConfig from './config/grpc.config';
import { DynamicRolesGuard } from './common/guards/dynamic-roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, grpcConfig],
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
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
                file: './logs/api-gateway-error.log',
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
                file: './logs/api-gateway-combined.log',
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
    HealthCheckModule,
    UsersModule,
    AuthModule,
    InventoryModule,
    MasterDataModule,
    IntegrationModule,
    EventsModule,
    MachineModule,
    UploadModule,
    AttendanceModule,
    GatewayConfigModule,
    NavigationModule,
  ],
  providers: [
    LoggingInterceptor,
    TransformInterceptor,
    DynamicRolesGuard,
  ],
})
export class AppModule { }
