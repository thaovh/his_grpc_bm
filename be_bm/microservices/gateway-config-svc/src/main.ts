import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Get configuration from env
  const grpcPort = process.env.PORT || 50058;

  // Create gRPC Microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'gateway_config',
      protoPath: join(__dirname, '_proto/gateway-config.proto'),
      url: `0.0.0.0:${grpcPort}`,
      loader: {
        keepCase: true,
        enums: String,
        objects: true,
        arrays: true,
        include: [join(__dirname, '_proto')],
      },
    },
  });

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen();
  console.log(`Gateway Config Microservice (gRPC) is running on: 0.0.0.0:${grpcPort}`);
}
bootstrap();
