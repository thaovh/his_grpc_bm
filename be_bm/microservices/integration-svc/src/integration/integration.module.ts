import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { IntegrationController } from './controllers/integration.controller';
import { IntegrationServiceImpl } from './services/integration.service';
import { HisProvider } from './providers/his.provider';
import { RedisService } from './services/redis.service';
import { UserSyncService } from './services/user-sync.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'USERS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: join(__dirname, '../_proto/users.proto'),
          url: `${process.env.USERS_SVC_URL || 'localhost'}:${process.env.USERS_SVC_PORT || '50051'}`,
          loader: {
            enums: String,
            objects: true,
            arrays: true,
          },
        },
      },
    ]),
  ],
  controllers: [IntegrationController],
  providers: [
    IntegrationServiceImpl,
    HisProvider,
    RedisService,
    UserSyncService,
  ],
  exports: [IntegrationServiceImpl],
})
export class IntegrationModule {}

