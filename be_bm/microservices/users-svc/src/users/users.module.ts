import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from 'nestjs-pino';

import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { DeviceToken } from './entities/device-token.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { UsersController } from './controllers/users.controller';
import { UsersServiceImpl } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { DeviceTokenRepository } from './repositories/device-token.repository';
import { RolesRepository } from './repositories/roles.repository';
import { UserRolesRepository } from './repositories/user-roles.repository';
import { RolesServiceImpl } from './services/roles.service';
import { UserRolesServiceImpl } from './services/user-roles.service';
import { UsersSeeder } from './users.seeder';

// Commands
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { UpdateUserHandler } from './commands/handlers/update-user.handler';
import { UpdateUserProfileHandler } from './commands/handlers/update-user-profile.handler';
import { UpdatePasswordHandler } from './commands/handlers/update-password.handler';

// Queries
import { GetUsersHandler } from './queries/handlers/get-users.handler';
import { GetUserByIdHandler } from './queries/handlers/get-user-by-id.handler';
import { GetUserByUsernameHandler } from './queries/handlers/get-user-by-username.handler';
import { GetUserByEmailHandler } from './queries/handlers/get-user-by-email.handler';
import { GetUserByAcsIdHandler } from './queries/handlers/get-user-by-acs-id.handler';
import { CountUsersHandler } from './queries/handlers/count-users.handler';

// Device Token Handlers
import { SaveDeviceTokenHandler, RemoveDeviceTokenHandler } from './commands/handlers/device-token-handlers.index';
import { GetDeviceTokensByEmployeeCodeHandler } from './queries/handlers/device-token-handlers.index';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  UpdateUserProfileHandler,
  UpdatePasswordHandler,
];

const QueryHandlers = [
  GetUsersHandler,
  GetUserByIdHandler,
  GetUserByUsernameHandler,
  GetUserByEmailHandler,
  GetUserByAcsIdHandler,
  CountUsersHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, DeviceToken, Role, UserRole]),
    CqrsModule,
    LoggerModule.forRoot({
      pinoHttp: {
        safe: true,
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
                translateTime: 'SYS:standard',
              },
            },
            {
              target: 'pino-roll',
              level: 'error',
              options: {
                file: './logs/users-svc-error.log',
                frequency: 'daily',
                mkdir: true,
                dateFormat: 'yyyy-MM-dd',
                limit: {
                  count: 14,
                },
              },
            },
            {
              target: 'pino-roll',
              level: 'info',
              options: {
                file: './logs/users-svc-combined.log',
                frequency: 'daily',
                mkdir: true,
                dateFormat: 'yyyy-MM-dd',
                limit: {
                  count: 14,
                },
              },
            },
          ],
        },
      } as any,
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersSeeder,
    UsersRepository,
    DeviceTokenRepository,
    RolesRepository,
    UserRolesRepository,
    // Register handlers explicitly
    CreateUserHandler,
    UpdateUserHandler,
    UpdateUserProfileHandler,
    UpdatePasswordHandler,
    GetUsersHandler,
    GetUserByIdHandler,
    GetUserByUsernameHandler,
    GetUserByEmailHandler,
    GetUserByAcsIdHandler,
    CountUsersHandler,
    // Device Token Handlers
    SaveDeviceTokenHandler,
    RemoveDeviceTokenHandler,
    GetDeviceTokensByEmployeeCodeHandler,
    {
      provide: 'UsersService',
      useClass: UsersServiceImpl,
    },
    {
      provide: 'RolesService',
      useClass: RolesServiceImpl,
    },
    {
      provide: 'UserRolesService',
      useClass: UserRolesServiceImpl,
    },
  ],
  exports: ['UsersService'],
})
export class UsersModule { }

