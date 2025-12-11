import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { forwardRef } from '@nestjs/common';
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
              protoPath: join(__dirname, '../_proto/users.proto'),
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
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController, RolesController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }

