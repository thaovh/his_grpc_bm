import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from '../auth/integration.service';
import { InventoryModule } from '../inventory/inventory.module';
import { MasterDataModule } from '../master-data/master-data.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'INTEGRATION_PACKAGE',
        useFactory: (configService: ConfigService) => {
          const grpcConfig = configService.get('grpc');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${grpcConfig.integration.url}:${grpcConfig.integration.port}`,
              package: 'integration',
              protoPath: join(__dirname, '../_proto/integration.proto'),
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
    ]),
    forwardRef(() => InventoryModule),
    MasterDataModule,
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule { }

