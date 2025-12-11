import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { UnitOfMeasure } from '../master-data/unit-of-measure/entities/unit-of-measure.entity';
import { ExportStatus } from '../master-data/export-status/entities/export-status.entity';
import { Branch } from '../master-data/branch/entities/branch.entity';
import { DepartmentType } from '../master-data/department-type/entities/department-type.entity';
import { Department } from '../master-data/department/entities/department.entity';
import { MachineFundingSource } from '../master-data/machine-funding-source/entities/machine-funding-source.entity';
import { ManufacturerCountry } from '../master-data/manufacturer-country/entities/manufacturer-country.entity';
import { MachineDocumentType } from '../master-data/machine-document-type/entities/machine-document-type.entity';
import { MachineCategory } from '../master-data/machine-category/entities/machine-category.entity';
import { MachineStatus } from '../master-data/machine-status/entities/machine-status.entity';
import { MachineUnit } from '../master-data/machine-unit/entities/machine-unit.entity';
import { Vendor } from '../master-data/vendor/entities/vendor.entity';
import { MaintenanceType } from '../master-data/maintenance-type/entities/maintenance-type.entity';
import { TransferStatus } from '../master-data/transfer-status/entities/transfer-status.entity';
import { TransferType } from '../master-data/transfer-type/entities/transfer-type.entity';
import { Manufacturer } from '../master-data/manufacturer/entities/manufacturer.entity';
import { NotificationType } from '../master-data/notification-type/entities/notification-type.entity';
import { AuditSubscriber } from '../commons/subscribers/audit.subscriber';

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
          entities: [
            UnitOfMeasure,
            ExportStatus,
            Branch,
            DepartmentType,
            Department,
            MachineFundingSource,
            ManufacturerCountry,
            MachineDocumentType,
            MachineCategory,
            MachineStatus,
            MachineUnit,
            Vendor,
            MaintenanceType,
            TransferStatus,
            TransferType,
            TransferType,
            Manufacturer,
            NotificationType,
          ],
          synchronize: true, // Disabled due to Oracle guard column issue
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

