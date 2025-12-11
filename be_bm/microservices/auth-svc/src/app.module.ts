import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
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
                file: './logs/auth-svc-error.log',
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
                file: './logs/auth-svc-combined.log',
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
    AuthModule,
  ],
})
export class AppModule { }

