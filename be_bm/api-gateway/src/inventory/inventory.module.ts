import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PROTO_PATH, PROTO_ROOT_DIR } from '@bmaibe/protos';


import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { ExpMestMedicineService } from './exp-mest-medicine.service';
import { ExpMestMedicineController } from './exp-mest-medicine.controller';
import { MasterDataModule } from '../master-data/master-data.module';
import { IntegrationModule } from '../integration/integration.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MasterDataModule,
    forwardRef(() => IntegrationModule),
    forwardRef(() => UsersModule),
    ClientsModule.registerAsync([
      {
        name: 'INVENTORY_PACKAGE',
        useFactory: (configService: ConfigService) => {
          const grpcConfig = configService.get('grpc');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${grpcConfig.inventory.url}:${grpcConfig.inventory.port}`,
              package: 'inventory',
              protoPath: PROTO_PATH.inventory.main,
              loader: {
                enums: String,
                objects: true,
                arrays: true,
                includeDirs: [PROTO_ROOT_DIR],
                keepCase: true, // Keep field names as in proto (working_state, not workingState)
                defaults: true, // Include default values
                oneofs: true,

              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [InventoryController, ExpMestMedicineController],
  providers: [InventoryService, ExpMestMedicineService],
  exports: [InventoryService, ExpMestMedicineService],
})
export class InventoryModule { }

