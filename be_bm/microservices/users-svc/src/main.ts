import { PROTO_PATH, PROTO_ROOT_DIR } from '@bmaibe/protos';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { GlobalRpcExceptionFilter } from './commons/filters/rpc-exception.filter';
import { UsersSeeder } from './users/users.seeder';


async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${process.env.URL}:${process.env.PORT}`,
      package: 'users',
      protoPath: PROTO_PATH.users,
      loader: {
        enums: String,
        objects: true,
        arrays: true,
        keepCase: true, // Keep field names as in proto (FindByIdWithProfile, not findByIdWithProfile)
        defaults: true, // Include default values
        oneofs: true,
        includeDirs: [PROTO_ROOT_DIR],

      },
    },
  });

  const pinoLogger = app.get(Logger);
  app.useLogger(pinoLogger);
  app.useGlobalFilters(new GlobalRpcExceptionFilter(pinoLogger));

  // TODO: Fix QueryHandler registration issue
  // Temporarily comment out seeder to allow service to start
  // const seeder: UsersSeeder = app.get(UsersSeeder);
  // await seeder.seedDatabase();

  await app.listen();
}

bootstrap();

