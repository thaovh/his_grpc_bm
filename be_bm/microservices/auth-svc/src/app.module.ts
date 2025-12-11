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
        ...(process.env.NODE_ENV === 'development' && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          },
        }),
      },
    }),
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}

