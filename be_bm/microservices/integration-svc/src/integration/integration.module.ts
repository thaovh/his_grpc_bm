import { Module } from '@nestjs/common';
import * as path from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PROTO_PATH, PROTO_ROOT_DIR } from '@bmaibe/protos';


import { IntegrationController } from './controllers/integration.controller';
import { IntegrationServiceImpl } from './services/integration.service';
import { HisProvider } from './providers/his.provider';
import { ExternalDbProvider } from './providers/external-db.provider';
import { RedisService } from './services/redis.service';
import { UserSyncService } from './services/user-sync.service';
import { DataMergeService } from './services/data-merge.service';
import { DataEnrichmentService } from './services/data-enrichment.service';
import { UsersEnrichmentJob } from './enrichment/jobs/users-enrichment.job';
import { QueryLoader } from './queries/query-loader';
import { ExpMestSyncService } from './services/exp-mest-sync.service';
import { ExpMestEnrichmentService } from './services/exp-mest-enrichment.service';
import { ExpMestAutoUpdateService } from './services/exp-mest-auto-update.service';
// Auth services
import { AuthTokenService } from './services/auth/auth-token.service';
import { AuthLoginService } from './services/auth/auth-login.service';
// Master data services
import { MediStockService } from './services/master-data/medi-stock.service';
import { ExpMestSttService } from './services/master-data/exp-mest-stt.service';
import { ExpMestTypeService } from './services/master-data/exp-mest-type.service';
// ExpMest services
import { ExpMestService } from './services/exp-mest/exp-mest.service';
import { InpatientExpMestService } from './services/exp-mest/inpatient-exp-mest.service';
import { ExpMestMedicineService } from './services/exp-mest/exp-mest-medicine.service';
// User & Work info services
import { UserRoomService } from './services/user/user-room.service';
import { WorkInfoService } from './services/work-info/work-info.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'USERS_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'users',
            protoPath: PROTO_PATH.users,
            url: `${configService.get('USERS_SVC_URL') || 'localhost'}:${configService.get('USERS_SVC_PORT') || '50051'}`,
            loader: {
              enums: String,
              objects: true,
              arrays: true,
              keepCase: true,
              defaults: true,
              oneofs: true,
              includeDirs: [PROTO_ROOT_DIR],
            },
          },
        }),
      },
      {
        name: 'INVENTORY_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'inventory',
            protoPath: PROTO_PATH.inventory.main,
            url: `${configService.get('INVENTORY_SVC_URL') || 'localhost'}:${configService.get('INVENTORY_SVC_PORT') || '50056'}`,
            loader: {
              enums: String,
              objects: true,
              arrays: true,
              keepCase: true,
              defaults: true,
              oneofs: true,
              includeDirs: [PROTO_ROOT_DIR],
            },
          },
        }),
      },
      {
        name: 'MASTER_DATA_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'master_data',
            protoPath: PROTO_PATH.masterData,
            url: `${configService.get('MASTER_DATA_SVC_URL') || 'localhost'}:${configService.get('MASTER_DATA_SVC_PORT') || '50055'}`,
            loader: {
              enums: String,
              objects: true,
              arrays: true,
              keepCase: true,
              defaults: true,
              oneofs: true,
              includeDirs: [PROTO_ROOT_DIR],
            },
          },
        }),
      },
    ]),
  ],
  controllers: [IntegrationController],
  providers: [
    IntegrationServiceImpl,
    HisProvider,
    ExternalDbProvider,
    RedisService,
    UserSyncService,
    DataMergeService,
    DataEnrichmentService,
    UsersEnrichmentJob,
    // Auth services
    AuthTokenService,
    AuthLoginService,
    // Master data services
    MediStockService,
    ExpMestSttService,
    ExpMestTypeService,
    // ExpMest services
    ExpMestService,
    InpatientExpMestService,
    ExpMestMedicineService,
    // User & Work info services
    UserRoomService,
    WorkInfoService,
    ExpMestSyncService,
    ExpMestEnrichmentService,
    ExpMestAutoUpdateService,
  ],
  exports: [IntegrationServiceImpl, ExpMestSyncService],
})
export class IntegrationModule { }
