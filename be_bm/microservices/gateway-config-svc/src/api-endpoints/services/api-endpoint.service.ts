import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';

import { ApiEndpoint } from '../entities/api-endpoint.entity';
import { CreateApiEndpointDto } from '../dto/create-api-endpoint.dto';
import { UpdateApiEndpointDto } from '../dto/update-api-endpoint.dto';
import { ApiEndpointResponseDto } from '../dto/api-endpoint-response.dto';

import { CreateApiEndpointCommand } from '../commands/create-api-endpoint.command';
import { UpdateApiEndpointCommand } from '../commands/update-api-endpoint.command';
import { DeleteApiEndpointCommand } from '../commands/delete-api-endpoint.command';
import { GetApiEndpointsQuery } from '../queries/get-api-endpoints.query';
import { GetApiEndpointByIdQuery } from '../queries/get-api-endpoint-by-id.query';
import { CountApiEndpointsQuery } from '../queries/count-api-endpoints.query';

@Injectable()
export class ApiEndpointService {
    private readonly logger = new Logger(ApiEndpointService.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    async create(dto: CreateApiEndpointDto): Promise<ApiEndpointResponseDto> {
        const endpoint = await this.commandBus.execute(new CreateApiEndpointCommand(dto));
        return this.toResponseDto(endpoint);
    }

    async findAll(module?: string): Promise<ApiEndpointResponseDto[]> {
        const options: FindManyOptions<ApiEndpoint> = {
            where: { isActive: 1 },
        };
        if (module) {
            options.where = { ...options.where as any, module };
        }
        const endpoints = await this.queryBus.execute(new GetApiEndpointsQuery(options));
        return endpoints.map(e => this.toResponseDto(e));
    }

    async findById(id: string): Promise<ApiEndpoint> {
        return this.queryBus.execute(new GetApiEndpointByIdQuery(id));
    }

    async update(id: string, dto: UpdateApiEndpointDto): Promise<ApiEndpointResponseDto> {
        const endpoint = await this.commandBus.execute(new UpdateApiEndpointCommand(id, dto));
        return this.toResponseDto(endpoint);
    }

    async delete(id: string): Promise<void> {
        await this.commandBus.execute(new DeleteApiEndpointCommand(id));
    }

    async count(options?: FindManyOptions<ApiEndpoint>): Promise<number> {
        return this.queryBus.execute(new CountApiEndpointsQuery(options));
    }

    public toResponseDto(endpoint: ApiEndpoint): ApiEndpointResponseDto {
        return {
            id: endpoint.id,
            path: endpoint.path,
            method: endpoint.method,
            description: endpoint.description,
            module: endpoint.module,
            isPublic: endpoint.isPublic === 1,
            roleCodes: endpoint.roles?.map(r => r.roleCode) || [],
            rateLimitRequests: endpoint.rateLimitRequests,
            rateLimitWindow: endpoint.rateLimitWindow,
            kongRouteId: endpoint.kongRouteId,
            kongRouteName: endpoint.kongRouteName,
            isActive: endpoint.isActive === 1,
            createdAt: endpoint.createdAt,
            updatedAt: endpoint.updatedAt,
            createdBy: endpoint.createdBy,
            updatedBy: endpoint.updatedBy,
        };
    }
}
