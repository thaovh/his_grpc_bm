import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';

import { Machine } from '../machine-management/machine/entities/machine.entity';
import { MaintenanceRecord } from '../machine-management/maintenance/entities/maintenance-record.entity';
import { MachineDocument } from '../machine-management/document/entities/machine-document.entity';
import { MachineTransfer } from '../machine-management/transfer/entities/transfer.entity';
import { AuditSubscriber } from '../commons/subscribers/audit.subscriber';

// Initialize oracledb in thin mode
try {
    oracledb.initOracleClient();
} catch (err) {
    // Already initialized or not needed
}

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const nodeEnv = configService.get('NODE_ENV') || process.env.NODE_ENV || 'development';
                const isDevelopment = nodeEnv !== 'production';

                const config = {
                    type: 'oracle',
                    host: configService.get('DB_HOST') || process.env.DB_HOST,
                    port: parseInt(configService.get('DB_PORT') || process.env.DB_PORT || '1521', 10),
                    username: configService.get('DB_USER') || process.env.DB_USER,
                    password: configService.get('DB_PASSWORD') || process.env.DB_PASSWORD,
                    database: configService.get('DB_NAME') || process.env.DB_NAME,
                    sid: configService.get('DB_SID') || process.env.DB_SID,
                    serviceName: configService.get('DB_SERVICE_NAME') || process.env.DB_SERVICE_NAME,
                    entities: [Machine, MaintenanceRecord, MachineDocument, MachineTransfer],
                    synchronize: true,
                    logging: isDevelopment,
                    retryAttempts: 3,
                    retryDelay: 3000,
                    extra: {
                        connectString: configService.get('DB_CONNECT_STRING') || process.env.DB_CONNECT_STRING,
                        poolMin: 2,
                        poolMax: 10,
                        queueTimeout: 120000,
                    },
                };
                console.log('Database Config:', JSON.stringify({ ...config, password: '***' }, null, 2));
                return config as any;
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }
