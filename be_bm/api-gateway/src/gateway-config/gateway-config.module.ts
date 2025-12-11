import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GatewayConfigService } from './gateway-config.service';
import { GatewayConfigController } from './gateway-config.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        AuthModule,
        ClientsModule.registerAsync([
            {
                name: 'GATEWAY_CONFIG_PACKAGE',
                useFactory: (configService: ConfigService) => {
                    const grpcConfig = configService.get('grpc');
                    const gatewayConfig = grpcConfig?.gatewayConfig || {};
                    return {
                        transport: Transport.GRPC,
                        options: {
                            url: `${gatewayConfig.url || 'localhost'}:${gatewayConfig.port || '50058'}`,
                            package: 'gateway_config',
                            protoPath: join(__dirname, '../_proto/gateway-config.proto'),
                            loader: {
                                keepCase: true,
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
    controllers: [GatewayConfigController],
    providers: [GatewayConfigService],
    exports: [GatewayConfigService],
})
export class GatewayConfigModule { }
