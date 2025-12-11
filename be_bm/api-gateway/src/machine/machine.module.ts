import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { MasterDataModule } from '../master-data/master-data.module';

@Module({
    imports: [
        MasterDataModule,
        ClientsModule.registerAsync([
            {
                name: 'MACHINE_PACKAGE',
                useFactory: (configService: ConfigService) => {
                    const grpcConfig = configService.get('grpc');
                    const machineConfig = grpcConfig?.machine || {};
                    return {
                        transport: Transport.GRPC,
                        options: {
                            url: `${machineConfig.url || 'localhost'}:${machineConfig.port || '50056'}`,
                            package: 'machine',
                            protoPath: join(__dirname, '../_proto/machine.proto'),
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
    providers: [MachineService],
    controllers: [MachineController],
    exports: [MachineService],
})
export class MachineModule { }
