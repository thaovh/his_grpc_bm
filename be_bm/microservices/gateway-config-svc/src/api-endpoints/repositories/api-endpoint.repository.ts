import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ApiEndpoint } from '../entities/api-endpoint.entity';
import { ApiEndpointRole } from '../entities/api-endpoint-role.entity';
import { CreateApiEndpointDto } from '../dto/create-api-endpoint.dto';
import { UpdateApiEndpointDto } from '../dto/update-api-endpoint.dto';

@Injectable()
export class ApiEndpointRepository {
    private readonly logger = new Logger(ApiEndpointRepository.name);

    constructor(
        @InjectRepository(ApiEndpoint)
        private readonly endpointRepo: Repository<ApiEndpoint>,
        @InjectRepository(ApiEndpointRole)
        private readonly roleRepo: Repository<ApiEndpointRole>,
    ) { }

    async create(dto: CreateApiEndpointDto): Promise<ApiEndpoint> {
        this.logger.log(`Creating/Updating endpoint: ${dto.method} ${dto.path}`);

        // Check if endpoint already exists (by path + method)
        let endpoint = await this.endpointRepo.findOne({
            where: {
                path: dto.path,
                method: dto.method.toUpperCase(),
            },
        });

        if (endpoint) {
            // Update existing endpoint
            this.logger.log(`Endpoint exists, updating: ${endpoint.id}`);
            endpoint.description = dto.description || '';
            endpoint.module = dto.module || '';
            endpoint.isPublic = dto.isPublic ? 1 : 0;
            endpoint.rateLimitRequests = dto.rateLimitRequests || null;
            endpoint.rateLimitWindow = dto.rateLimitWindow || null;
            endpoint.resourceName = dto.resourceName || null;
            endpoint.action = dto.action || null;
            endpoint.isActive = 1;
            endpoint.updatedAt = new Date();
            endpoint.updatedBy = dto.createdBy || null;
            endpoint.version += 1;
        } else {
            // Create new endpoint
            this.logger.log(`Endpoint does not exist, creating new`);
            endpoint = new ApiEndpoint();
            endpoint.id = uuidv4();
            endpoint.path = dto.path;
            endpoint.method = dto.method.toUpperCase();
            endpoint.description = dto.description || '';
            endpoint.module = dto.module || '';
            endpoint.isPublic = dto.isPublic ? 1 : 0;
            endpoint.rateLimitRequests = dto.rateLimitRequests || null;
            endpoint.rateLimitWindow = dto.rateLimitWindow || null;
            endpoint.resourceName = dto.resourceName || null;
            endpoint.action = dto.action || null;
            endpoint.isActive = 1;
            endpoint.version = 1;
            endpoint.createdAt = new Date();
            endpoint.updatedAt = new Date();
            endpoint.createdBy = dto.createdBy || null;
            endpoint.updatedBy = null;
            endpoint.deletedAt = null;
        }

        const savedEndpoint = await this.endpointRepo.save(endpoint);

        // Sync roles: delete existing roles and add new ones
        if (endpoint.id) {
            // Delete existing roles for this endpoint
            await this.roleRepo.delete({ endpointId: savedEndpoint.id });
        }

        if (dto.roleCodes && dto.roleCodes.length > 0) {
            const roles = dto.roleCodes.map(roleCode => {
                const role = new ApiEndpointRole();
                role.id = uuidv4();
                role.endpointId = savedEndpoint.id;
                role.roleCode = roleCode;
                role.isActive = 1;
                role.version = 1;
                role.createdAt = new Date();
                role.updatedAt = new Date();
                role.createdBy = dto.createdBy || null;
                role.updatedBy = null;
                role.deletedAt = null;
                return role;
            });

            await this.roleRepo.save(roles);
        }

        return this.findById(savedEndpoint.id);
    }

    async update(id: string, dto: UpdateApiEndpointDto): Promise<ApiEndpoint> {
        this.logger.log(`Updating endpoint ID: ${id}`);
        const endpoint = await this.findById(id);

        if (dto.description !== undefined) endpoint.description = dto.description;
        if (dto.module !== undefined) endpoint.module = dto.module;
        if (dto.isPublic !== undefined) endpoint.isPublic = dto.isPublic ? 1 : 0;
        if (dto.rateLimitRequests !== undefined) endpoint.rateLimitRequests = dto.rateLimitRequests;
        if (dto.rateLimitWindow !== undefined) endpoint.rateLimitWindow = dto.rateLimitWindow;
        if (dto.resourceName !== undefined) endpoint.resourceName = dto.resourceName || null;
        if (dto.action !== undefined) endpoint.action = dto.action || null;

        endpoint.updatedAt = new Date();
        endpoint.updatedBy = dto.updatedBy || null;
        endpoint.version += 1;

        await this.endpointRepo.save(endpoint);

        if (dto.roleCodes !== undefined) {
            await this.roleRepo.delete({ endpointId: id });

            if (dto.roleCodes.length > 0) {
                const roles = dto.roleCodes.map(roleCode => {
                    const role = new ApiEndpointRole();
                    role.id = uuidv4();
                    role.endpointId = id;
                    role.roleCode = roleCode;
                    role.isActive = 1;
                    role.version = 1;
                    role.createdAt = new Date();
                    role.updatedAt = new Date();
                    role.createdBy = dto.updatedBy || null;
                    role.updatedBy = null;
                    role.deletedAt = null;
                    return role;
                });

                await this.roleRepo.save(roles);
            }
        }

        return this.findById(id);
    }

    async findAll(options?: FindManyOptions<ApiEndpoint>): Promise<ApiEndpoint[]> {
        return this.endpointRepo.find({
            ...options,
            relations: options?.relations || ['roles'],
        });
    }

    async findByPathAndMethod(path: string, method: string): Promise<ApiEndpoint | null> {
        return this.endpointRepo.findOne({
            where: { path, method, isActive: 1 },
            relations: ['roles']
        });
    }

    async findByResourceAndAction(resourceName: string, action: string, method: string): Promise<ApiEndpoint | null> {
        return this.endpointRepo.findOne({
            where: { resourceName, action, method, isActive: 1 },
            relations: ['roles']
        });
    }

    async findById(id: string): Promise<ApiEndpoint> {
        const endpoint = await this.endpointRepo.findOne({
            where: { id },
            relations: ['roles'],
        });

        if (!endpoint) {
            throw new NotFoundException(`Endpoint with ID ${id} not found`);
        }

        return endpoint;
    }

    async delete(id: string): Promise<void> {
        const endpoint = await this.findById(id);
        endpoint.deletedAt = new Date();
        endpoint.isActive = 0;
        endpoint.updatedAt = new Date();
        await this.endpointRepo.save(endpoint);
    }

    async count(options?: FindManyOptions<ApiEndpoint>): Promise<number> {
        return this.endpointRepo.count(options);
    }

    async updateKongRouteInfo(id: string, kongRouteId: string, kongRouteName: string): Promise<void> {
        await this.endpointRepo.update(id, {
            kongRouteId,
            kongRouteName,
            updatedAt: new Date(),
        });
    }
}
