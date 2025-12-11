import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { HealthCheckModule } from './health-check/health-check.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import appConfig from './config/app.config';
import grpcConfig from './config/grpc.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, grpcConfig],
      isGlobal: true,
    }),
    LoggerModule.forRoot(),
    HealthCheckModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    LoggingInterceptor,
    TransformInterceptor,
  ],
})
export class AppModule {}
