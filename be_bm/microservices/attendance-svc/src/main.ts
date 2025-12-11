import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create hybrid application (HTTP + gRPC)
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use Pino logger
  app.useLogger(app.get(Logger));

  // Configure HTTP
  app.setGlobalPrefix('api/attendance');
  app.enableCors();

  // Configure gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'attendance',
      protoPath: join(__dirname, './_proto/attendance.proto'),
      url: `0.0.0.0:${process.env.GRPC_PORT || 50057}`,
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [join(__dirname, './_proto')],
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.HTTP_PORT || 3006);

  const logger = app.get(Logger);
  logger.log(`HTTP Server running on: ${await app.getUrl()}`);
  logger.log(`gRPC Server running on: 0.0.0.0:${process.env.GRPC_PORT || 50056}`);
}
bootstrap();
