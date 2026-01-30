import { PROTO_PATH, PROTO_ROOT_DIR } from '@bmaibe/protos';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { GlobalRpcExceptionFilter } from './commons/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${process.env.URL || '0.0.0.0'}:${process.env.PORT || '50053'}`,
      package: 'integration',
      protoPath: PROTO_PATH.integration,
      loader: {
        enums: String,
        objects: true,
        arrays: true,
        includeDirs: [PROTO_ROOT_DIR],
      },
    },
  });

  const pinoLogger = app.get(Logger);
  app.useLogger(pinoLogger);
  app.useGlobalFilters(new GlobalRpcExceptionFilter(pinoLogger));

  await app.listen();

  const logger = app.get(Logger);
  logger.log(`Integration microservice is running on: ${process.env.URL || '0.0.0.0'}:${process.env.PORT || '50053'}`);
}

bootstrap();

