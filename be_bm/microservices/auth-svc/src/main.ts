import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${process.env.URL || '0.0.0.0'}:${process.env.PORT || '50052'}`,
      package: 'auth',
      protoPath: join(__dirname, './_proto/auth.proto'),
      loader: {
        enums: String,
        objects: true,
        arrays: true,
      },
    },
  });

  app.useLogger(app.get(Logger));

  await app.listen();

  const logger = app.get(Logger);
  logger.log(`Auth microservice is running on: ${process.env.URL || '0.0.0.0'}:${process.env.PORT || '50052'}`);
}

bootstrap();

