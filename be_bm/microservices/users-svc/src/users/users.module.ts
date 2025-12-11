import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from 'nestjs-pino';

import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UsersController } from './controllers/users.controller';
import { UsersServiceImpl } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersSeeder } from './users.seeder';

// Commands
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { UpdateUserHandler } from './commands/handlers/update-user.handler';
import { UpdateUserProfileHandler } from './commands/handlers/update-user-profile.handler';

// Queries
import { GetUsersHandler } from './queries/handlers/get-users.handler';
import { GetUserByIdHandler } from './queries/handlers/get-user-by-id.handler';
import { GetUserByUsernameHandler } from './queries/handlers/get-user-by-username.handler';
import { GetUserByEmailHandler } from './queries/handlers/get-user-by-email.handler';
import { GetUserByAcsIdHandler } from './queries/handlers/get-user-by-acs-id.handler';
import { CountUsersHandler } from './queries/handlers/count-users.handler';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  UpdateUserProfileHandler,
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
    TypeOrmModule.forFeature([User, UserProfile]),
    CqrsModule,
    LoggerModule.forRoot({
      pinoHttp: {
        safe: true,
        ...(process.env.NODE_ENV === 'development' && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          },
        }),
      },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersSeeder,
    UsersRepository,
    // Register handlers explicitly
    CreateUserHandler,
    UpdateUserHandler,
    UpdateUserProfileHandler,
    GetUsersHandler,
    GetUserByIdHandler,
    GetUserByUsernameHandler,
    GetUserByEmailHandler,
    GetUserByAcsIdHandler,
    CountUsersHandler,
    {
      provide: 'UsersService',
      useClass: UsersServiceImpl,
    },
  ],
  exports: ['UsersService'],
})
export class UsersModule {}

