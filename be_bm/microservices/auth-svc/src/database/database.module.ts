import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { AuthToken } from '../auth/entities/auth-token.entity';

// Initialize oracledb in thin mode (no Oracle Instant Client required)
try {
  oracledb.initOracleClient();
  console.log('Using oracledb with Oracle Instant Client');
} catch (err: any) {
  console.log('Using oracledb thin mode (no Oracle Instant Client required)');
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get('NODE_ENV') || process.env.NODE_ENV || 'development';
        const isDevelopment = nodeEnv !== 'production';
        
        return {
          type: 'oracle',
          host: configService.get('DB_HOST') || process.env.DB_HOST,
          port: parseInt(configService.get('DB_PORT') || process.env.DB_PORT || '1521', 10),
          username: configService.get('DB_USER') || process.env.DB_USER,
          password: configService.get('DB_PASSWORD') || process.env.DB_PASSWORD,
          database: configService.get('DB_NAME') || process.env.DB_NAME,
          sid: configService.get('DB_SID') || process.env.DB_SID,
          serviceName: configService.get('DB_SERVICE_NAME') || process.env.DB_SERVICE_NAME,
          entities: [AuthToken],
          synchronize: isDevelopment || configService.get('DB_SYNCHRONIZE') === 'true',
          logging: isDevelopment,
          retryAttempts: 3,
          retryDelay: 3000,
          extra: {
            connectString: configService.get('DB_CONNECT_STRING') || process.env.DB_CONNECT_STRING || `${configService.get('DB_HOST') || process.env.DB_HOST}:${configService.get('DB_PORT') || process.env.DB_PORT || '1521'}/${configService.get('DB_SERVICE_NAME') || process.env.DB_SERVICE_NAME || configService.get('DB_NAME') || process.env.DB_NAME}`,
            poolMin: 2,
            poolMax: 10,
            queueTimeout: 120000,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
