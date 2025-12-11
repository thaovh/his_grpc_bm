import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { User } from '../users/entities/user.entity';
import { UserProfile } from '../users/entities/user-profile.entity';
import { DeviceToken } from '../users/entities/device-token.entity';
import { Role } from '../users/entities/role.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { AuditSubscriber } from '../commons/subscribers/audit.subscriber';

// Initialize oracledb in thin mode (no Oracle Instant Client required)
// Thin mode is a pure JavaScript implementation - no native libraries needed
// If initOracleClient() is not called or fails, oracledb automatically uses thin mode
try {
  // Try to initialize with Oracle Instant Client if available
  oracledb.initOracleClient();
  console.log('Using oracledb with Oracle Instant Client');
} catch (err: any) {
  // If Oracle Instant Client is not available, automatically falls back to thin mode
  // Thin mode works without any additional installation
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
          entities: [User, UserProfile, DeviceToken, Role, UserRole],
          // Temporarily disable AuditSubscriber to debug NJS-044 error
          // subscribers: [AuditSubscriber],
          // Auto-sync schema: TypeORM sẽ tự động tạo/update tables khi service khởi động
          // Trong development mode: true (tự động sync)
          // Trong production: false (phải dùng migrations)
          // Tạm thời tắt synchronize vì Oracle guard column issue (SYS_NC00018$)
          // Sử dụng migration SQL thủ công để add các columns mới
          synchronize: false, // Disabled due to Oracle guard column issue
          // synchronize: isDevelopment || configService.get('DB_SYNCHRONIZE') === 'true',
          logging: isDevelopment,
          retryAttempts: 3,
          retryDelay: 3000,
          extra: {
            connectString: configService.get('DB_CONNECT_STRING') || process.env.DB_CONNECT_STRING,
            poolMin: 2,
            poolMax: 10,
            queueTimeout: 120000, // 2 minutes
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }
