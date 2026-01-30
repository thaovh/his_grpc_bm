import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PROTO_PATH, PROTO_ROOT_DIR } from '@bmaibe/protos';
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
              protoPath: PROTO_PATH.integration,
              loader: {
                enums: String,
                objects: true,
                arrays: true,
                includeDirs: [PROTO_ROOT_DIR],

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

