import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { GlobalRpcExceptionFilter } from './commons/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${process.env.URL}:${process.env.PORT}`,
      package: 'master_data',
      protoPath: join(__dirname, './_proto/master-data.proto'),
      enums: String,
      objects: true,
      arrays: true,
      include: [join(__dirname, './_proto')],
    },
  });

  const pinoLogger = app.get(Logger);
  app.useLogger(pinoLogger);
  app.useGlobalFilters(new GlobalRpcExceptionFilter(pinoLogger));

  await app.listen();
}

bootstrap(); // trigger