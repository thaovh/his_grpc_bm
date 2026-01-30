import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { forwardRef } from '@nestjs/common';
import { PROTO_PATH, PROTO_ROOT_DIR } from '@bmaibe/protos';

import { AuthModule } from '../auth/auth.module';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { RolesController } from './roles.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'USERS_PACKAGE',
        useFactory: (configService: ConfigService) => {
          const grpcConfig = configService.get('grpc');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${grpcConfig.users.url}:${grpcConfig.users.port}`,
              package: 'users',
              protoPath: PROTO_PATH.users,
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
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController, RolesController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }

