import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { ApiEndpoint } from './entities/api-endpoint.entity';
import { ApiEndpointRole } from './entities/api-endpoint-role.entity';
import { ApiEndpointService } from './services/api-endpoint.service';
import { ApiEndpointRestController } from './controllers/api-endpoint-rest.controller';
import { ApiEndpointGrpcController } from './controllers/api-endpoint-grpc.controller';
import { ApiEndpointRepository } from './repositories/api-endpoint.repository';
import { KongSyncModule } from '../kong-sync/kong-sync.module';
import { forwardRef } from '@nestjs/common';

import { CreateApiEndpointHandler } from './commands/handlers/create-api-endpoint.handler';
import { UpdateApiEndpointHandler } from './commands/handlers/update-api-endpoint.handler';
import { DeleteApiEndpointHandler } from './commands/handlers/delete-api-endpoint.handler';
import { GetApiEndpointsHandler } from './queries/handlers/get-api-endpoints.handler';
import { GetApiEndpointByIdHandler } from './queries/handlers/get-api-endpoint-by-id.handler';
import { CountApiEndpointsHandler } from './queries/handlers/count-api-endpoints.handler';

const Handlers = [
    CreateApiEndpointHandler,
    UpdateApiEndpointHandler,
    DeleteApiEndpointHandler,
    GetApiEndpointsHandler,
    GetApiEndpointByIdHandler,
    CountApiEndpointsHandler,
];

@Module({
    imports: [
        TypeOrmModule.forFeature([ApiEndpoint, ApiEndpointRole]),
        CqrsModule,
        forwardRef(() => KongSyncModule),
    ],
    providers: [
        ApiEndpointService,
        ApiEndpointRepository,
        ...Handlers,
    ],
    controllers: [
        ApiEndpointRestController,
        ApiEndpointGrpcController,
    ],
    exports: [ApiEndpointService, ApiEndpointRepository],
})
export class ApiEndpointsModule { }
