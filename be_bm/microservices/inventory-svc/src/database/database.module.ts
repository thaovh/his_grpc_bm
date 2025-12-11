import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { ExpMest } from '../inventory/entities/exp-mest.entity';
import { ExpMestMedicine } from '../inventory/entities/exp-mest-medicine.entity';
import { InpatientExpMest } from '../inventory/entities/inpatient-exp-mest.entity';
import { AuditSubscriber } from '../commons/subscribers/audit.subscriber';
import { InpatientExpMestMedicine } from '@/inventory/entities/inpatient-exp-mest-medicine.entity';
import { InpatientExpMestChild } from '@/inventory/entities/inpatient-exp-mest-child.entity';
import { ExpMestOther } from '@/inventory/entities/exp-mest-other.entity';
import { ExpMestOtherMedicine } from '@/inventory/entities/exp-mest-other-medicine.entity';
import { ExpMestCabinet } from '@/inventory/entities/exp-mest-cabinet.entity';
import { ExpMestCabinetMedicine } from '@/inventory/entities/exp-mest-cabinet-medicine.entity';

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
          entities: [ExpMest, ExpMestMedicine, InpatientExpMest, InpatientExpMestMedicine, InpatientExpMestChild, ExpMestOther, ExpMestOtherMedicine, ExpMestCabinet, ExpMestCabinetMedicine],
          synchronize: true, // Disabled due to Oracle guard column issue and index conflicts
          logging: false,
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

