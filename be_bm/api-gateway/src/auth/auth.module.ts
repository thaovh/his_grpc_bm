import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PROTO_PATH, PROTO_ROOT_DIR } from '@bmaibe/protos';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersModule } from '../users/users.module';
import { InventoryModule } from '../inventory/inventory.module';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        useFactory: (configService: ConfigService) => {
          const grpcConfig = configService.get('grpc');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${grpcConfig.auth.url}:${grpcConfig.auth.port}`,
              package: 'auth',
              protoPath: PROTO_PATH.auth,
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
    IntegrationModule,
    forwardRef(() => UsersModule),
    forwardRef(() => InventoryModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, ClientsModule],
})
export class AuthModule { }
