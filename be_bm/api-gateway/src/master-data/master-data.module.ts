import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PROTO_PATH, PROTO_ROOT_DIR } from '@bmaibe/protos';

import { MasterDataService } from './master-data.service';
import { MasterDataController } from './master-data.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MASTER_DATA_PACKAGE',
        useFactory: (configService: ConfigService) => {
          const grpcConfig = configService.get('grpc');
          const masterDataConfig = grpcConfig?.masterData || {};
          return {
            transport: Transport.GRPC,
            options: {
              url: `${masterDataConfig.url || 'localhost'}:${masterDataConfig.port || '50055'}`,
              package: 'master_data',
              protoPath: PROTO_PATH.masterData,
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
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService],
  exports: [MasterDataService],
})
export class MasterDataModule { }

