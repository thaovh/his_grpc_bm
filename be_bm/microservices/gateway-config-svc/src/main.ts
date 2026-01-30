import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PROTO_PATH, PROTO_ROOT_DIR } from '@bmaibe/protos';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Get configuration from env
  const grpcPort = process.env.PORT || 50058;

  // Create gRPC Microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'gateway_config',
      protoPath: PROTO_PATH.gatewayConfig,
      url: `0.0.0.0:${grpcPort}`,
      loader: {
        keepCase: true,
        enums: String,
        oneofs: true,
        includeDirs: [PROTO_ROOT_DIR],
        arrays: true,

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
