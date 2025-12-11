import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { ExpMest } from './entities/exp-mest.entity';
import { ExpMestMedicine } from './entities/exp-mest-medicine.entity';
import { InpatientExpMest } from './entities/inpatient-exp-mest.entity';
import { InpatientExpMestChild } from './entities/inpatient-exp-mest-child.entity';
import { InpatientExpMestMedicine } from './entities/inpatient-exp-mest-medicine.entity';
import { ExpMestOther } from './entities/exp-mest-other.entity';
import { ExpMestOtherMedicine } from './entities/exp-mest-other-medicine.entity';
import { ExpMestCabinet } from './entities/exp-mest-cabinet.entity';
import { ExpMestCabinetMedicine } from './entities/exp-mest-cabinet-medicine.entity';
import { InventoryController } from './controllers/inventory.controller';
import { ExpMestMedicineController } from './controllers/exp-mest-medicine.controller';
import { InpatientExpMestController } from './controllers/inpatient-exp-mest.controller';
import { InpatientExpMestChildController } from './controllers/inpatient-exp-mest-child.controller';
import { InpatientExpMestMedicineController } from './controllers/inpatient-exp-mest-medicine.controller';
import { ExpMestOtherController } from './controllers/exp-mest-other.controller';
import { ExpMestOtherMedicineController } from './controllers/exp-mest-other-medicine.controller';
import { ExpMestCabinetController } from './controllers/exp-mest-cabinet.controller';
import { ExpMestCabinetMedicineController } from './controllers/exp-mest-cabinet-medicine.controller';
import { ExpMestSummaryGrpcController } from './controllers/exp-mest-summary-grpc.controller';
import { ExpMestWorkingStateGrpcController } from './controllers/exp-mest-working-state-grpc.controller';
import { InventoryServiceImpl } from './services/inventory.service';
import { ExpMestMedicineServiceImpl } from './services/exp-mest-medicine.service';
import { InpatientExpMestService } from './services/inpatient-exp-mest.service';
import { InpatientExpMestChildService } from './services/inpatient-exp-mest-child.service';
import { InpatientExpMestMedicineService } from './services/inpatient-exp-mest-medicine.service';
import { ExpMestOtherService } from './services/exp-mest-other.service';
import { ExpMestOtherMedicineService } from './services/exp-mest-other-medicine.service';
import { ExpMestCabinetService } from './services/exp-mest-cabinet.service';
import { ExpMestCabinetMedicineService } from './services/exp-mest-cabinet-medicine.service';
import { ExpMestSummaryService } from './services/exp-mest-summary.service';
import { ExpMestWorkingStateService } from './services/exp-mest-working-state.service';
import { InventoryRepository } from './repositories/inventory.repository';
import { ExpMestMedicineRepository } from './repositories/exp-mest-medicine.repository';
import { InpatientExpMestRepository } from './repositories/inpatient-exp-mest.repository';
import { InpatientExpMestChildRepository } from './repositories/inpatient-exp-mest-child.repository';
import { InpatientExpMestMedicineRepository } from './repositories/inpatient-exp-mest-medicine.repository';
import { ExpMestOtherRepository } from './repositories/exp-mest-other.repository';
import { ExpMestOtherMedicineRepository } from './repositories/exp-mest-other-medicine.repository';
import { ExpMestCabinetRepository } from './repositories/exp-mest-cabinet.repository';
import { ExpMestCabinetMedicineRepository } from './repositories/exp-mest-cabinet-medicine.repository';

// Commands
import { CreateExpMestHandler } from './commands/handlers/create-exp-mest.handler';
import { UpdateExpMestHandler } from './commands/handlers/update-exp-mest.handler';
import { CreateExpMestMedicineHandler } from './commands/handlers/create-exp-mest-medicine.handler';
import { UpdateExpMestMedicineHandler } from './commands/handlers/update-exp-mest-medicine.handler';

// Queries
import { GetExpMestsHandler } from './queries/handlers/get-exp-mests.handler';
import { GetExpMestByIdHandler } from './queries/handlers/get-exp-mest-by-id.handler';
import { GetExpMestByExpMestIdHandler } from './queries/handlers/get-exp-mest-by-exp-mest-id.handler';
import { CountExpMestsHandler } from './queries/handlers/count-exp-mests.handler';
import { GetExpMestMedicinesHandler } from './queries/handlers/get-exp-mest-medicines.handler';
import { GetExpMestMedicineByIdHandler } from './queries/handlers/get-exp-mest-medicine-by-id.handler';
import { GetExpMestMedicineByHisIdHandler } from './queries/handlers/get-exp-mest-medicine-by-his-id.handler';
import { GetExpMestMedicinesByExpMestIdHandler } from './queries/handlers/get-exp-mest-medicines-by-exp-mest-id.handler';
import { CountExpMestMedicinesHandler } from './queries/handlers/count-exp-mest-medicines.handler';

const CommandHandlers = [
  CreateExpMestHandler,
  UpdateExpMestHandler,
  CreateExpMestMedicineHandler,
  UpdateExpMestMedicineHandler,
];

const QueryHandlers = [
  GetExpMestsHandler,
  GetExpMestByIdHandler,
  GetExpMestByExpMestIdHandler,
  CountExpMestsHandler,
  GetExpMestMedicinesHandler,
  GetExpMestMedicineByIdHandler,
  GetExpMestMedicineByHisIdHandler,
  GetExpMestMedicinesByExpMestIdHandler,
  CountExpMestMedicinesHandler,
];

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'MASTER_DATA_PACKAGE',
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.GRPC,
            options: {
              url: `${process.env.MASTER_DATA_SVC_URL || 'localhost'}:${process.env.MASTER_DATA_SVC_PORT || '50055'}`,
              package: 'master_data',
              protoPath: join(__dirname, '../_proto/master-data.proto'),
              loader: {
                enums: String,
                objects: true,
                arrays: true,
                include: [join(__dirname, '../_proto')],
              },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'USERS_PACKAGE',
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.GRPC,
            options: {
              url: `${process.env.USERS_SVC_URL || 'localhost'}:${process.env.USERS_SVC_PORT || '50051'}`,
              package: 'users',
              protoPath: join(__dirname, '../_proto/users.proto'),
              loader: {
                enums: String,
                objects: true,
                arrays: true,
                keepCase: true, // Keep field names as in proto (FindByIdWithProfile, not findByIdWithProfile)
                defaults: true, // Include default values
                oneofs: true,
                include: [join(__dirname, '../_proto')],
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    TypeOrmModule.forFeature([
      ExpMest,
      ExpMestMedicine,
      InpatientExpMest,
      InpatientExpMestChild,
      InpatientExpMestMedicine,
      ExpMestOther,
      ExpMestOtherMedicine,
      ExpMestCabinet,
      ExpMestCabinetMedicine,
    ]),
    CqrsModule,
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
                file: './logs/inventory-svc-error.log',
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
                file: './logs/inventory-svc-combined.log',
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
  ],
  controllers: [
    InventoryController,
    ExpMestMedicineController,
    InpatientExpMestController,
    InpatientExpMestChildController,
    InpatientExpMestMedicineController,
    ExpMestOtherController,
    ExpMestOtherMedicineController,
    ExpMestCabinetController,
    ExpMestCabinetMedicineController,
    ExpMestSummaryGrpcController,
    ExpMestWorkingStateGrpcController,
  ],
  providers: [
    InventoryRepository,
    ExpMestMedicineRepository,
    InpatientExpMestRepository,
    InpatientExpMestChildRepository,
    InpatientExpMestMedicineRepository,
    ExpMestOtherRepository,
    ExpMestOtherMedicineRepository,
    ExpMestCabinetRepository,
    ExpMestCabinetMedicineRepository,
    // Register handlers explicitly
    CreateExpMestHandler,
    UpdateExpMestHandler,
    GetExpMestsHandler,
    GetExpMestByIdHandler,
    GetExpMestByExpMestIdHandler,
    CountExpMestsHandler,
    CreateExpMestMedicineHandler,
    UpdateExpMestMedicineHandler,
    GetExpMestMedicinesHandler,
    GetExpMestMedicineByIdHandler,
    GetExpMestMedicineByHisIdHandler,
    GetExpMestMedicinesByExpMestIdHandler,
    CountExpMestMedicinesHandler,
    {
      provide: 'InventoryService',
      useClass: InventoryServiceImpl,
    },
    {
      provide: 'ExpMestMedicineService',
      useClass: ExpMestMedicineServiceImpl,
    },
    InpatientExpMestService,
    InpatientExpMestChildService,
    InpatientExpMestMedicineService,
    ExpMestOtherService,
    ExpMestOtherMedicineService,
    ExpMestCabinetService,
    ExpMestCabinetMedicineService,
    ExpMestSummaryService,
    ExpMestWorkingStateService,
  ],
  exports: [
    'InventoryService',
    'ExpMestMedicineService',
    InpatientExpMestService,
    InpatientExpMestChildService,
    InpatientExpMestMedicineService,
    ExpMestOtherService,
    ExpMestOtherMedicineService,
    ExpMestCabinetService,
  ],
})
export class InventoryModule { }

