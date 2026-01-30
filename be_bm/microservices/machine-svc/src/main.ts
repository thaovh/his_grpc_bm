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
            url: `${process.env.URL || '0.0.0.0'}:${process.env.PORT || '50055'}`,
            package: 'machine',
            protoPath: PROTO_PATH.machine,
            loader: {
                enums: String,
                objects: true,
                arrays: true,
                includeDirs: [PROTO_ROOT_DIR],
            },
        },
    });

    app.useLogger(app.get(Logger));
    const logger = app.get(Logger);
    app.useGlobalFilters(new GlobalRpcExceptionFilter(logger));

    await app.listen();
}

bootstrap();
