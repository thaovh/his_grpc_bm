import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
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
    ]),
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService],
  exports: [MasterDataService],
})
export class MasterDataModule { }

