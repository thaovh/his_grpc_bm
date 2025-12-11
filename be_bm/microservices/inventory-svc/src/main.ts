import { join } from 'path';
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
      protoPath: join(__dirname, './_proto/inventory.proto'),
      loader: {
        enums: String,
        objects: true,
        arrays: true,
        keepCase: true, // Keep field names as in proto (working_state, not workingState)
        defaults: true, // Include default values
        oneofs: true,
        include: [join(__dirname, './_proto')],
      },
    },
  });

  app.useLogger(app.get(Logger));

  await app.listen();
}

bootstrap();

