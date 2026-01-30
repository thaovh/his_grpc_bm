import { PROTO_PATH, PROTO_ROOT_DIR } from '@bmaibe/protos';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${process.env.URL}:${process.env.PORT}`,
      package: 'inventory',
      protoPath: PROTO_PATH.inventory.main,
      loader: {
        enums: String,
        objects: true,
        arrays: true,
        keepCase: true, // Keep field names as in proto (working_state, not workingState)
        defaults: true, // Include default values
        oneofs: true,
        includeDirs: [PROTO_ROOT_DIR],

      },
    },
  });

  app.useLogger(app.get(Logger));

  await app.listen();
}

bootstrap();

