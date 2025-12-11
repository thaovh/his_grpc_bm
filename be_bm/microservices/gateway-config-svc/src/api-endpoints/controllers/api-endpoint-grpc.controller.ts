import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ApiEndpointService } from '../services/api-endpoint.service';
import { KongSyncService } from '../../kong-sync/services/kong-sync.service';
import { ApiEndpointRepository } from '../repositories/api-endpoint.repository';

@Controller()
export class ApiEndpointGrpcController {
    private readonly logger = new Logger(ApiEndpointGrpcController.name);

    constructor(
        private readonly service: ApiEndpointService,
        private readonly kongSyncService: KongSyncService,
        private readonly endpointRepository: ApiEndpointRepository,
    ) { }

    @GrpcMethod('GatewayConfigService', 'GetEndpoints')
    async getEndpoints(data: { module?: string; is_active?: boolean }) {
        const endpoints = await this.service.findAll(data.module);
        return { endpoints: endpoints.map(e => this.mapToProto(e)) };
    }



    @GrpcMethod('GatewayConfigService', 'CreateEndpoint')
    async createEndpoint(data: any) {
        try {
            console.log('Received CreateEndpoint data keys:', Object.keys(data));
            console.log('Received role_codes:', data.role_codes);

            // Map snake_case from gRPC (keepCase: true) to camelCase for DTO
            const dto = {
                ...data,
                isPublic: data.is_public,
                roleCodes: data.role_codes,
                rateLimitRequests: data.rate_limit_requests,
                rateLimitWindow: data.rate_limit_window,
                resourceName: data.resource_name,
                action: data.action,
                createdBy: data.created_by
            };

            const result = await this.service.create(dto);
            const endpoint = await this.service.findById(result.id);
            await this.kongSyncService.syncEndpoint(endpoint);
            return this.mapToProto(result);
        } catch (error) {
            console.error('Error in createEndpoint:', error);
            throw error;
        }
    }

    @GrpcMethod('GatewayConfigService', 'GetEndpointByPath')
    async getEndpointByPath(data: { path: string; method: string }) {
        const endpoint = await this.endpointRepository.findByPathAndMethod(data.path, data.method);

        if (!endpoint) {
            throw new RpcException({
                code: 5, // NOT_FOUND
                message: `Endpoint not found: ${data.method} ${data.path}`
            });
        }

        return {
            id: endpoint.id,
            path: endpoint.path,
            method: endpoint.method,
            description: endpoint.description,
            module: endpoint.module,
            is_public: endpoint.isPublic,
            role_codes: endpoint.roles?.map(r => r.roleCode) || [],
            rate_limit_requests: endpoint.rateLimitRequests,
            rate_limit_window: endpoint.rateLimitWindow,
            resource_name: endpoint.resourceName,
            action: endpoint.action
        };
    }

    @GrpcMethod('GatewayConfigService', 'GetEndpointByResource')
    async getEndpointByResource(data: { resource_name: string; action: string; method: string }) {
        const endpoint = await this.endpointRepository.findByResourceAndAction(
            data.resource_name,
            data.action,
            data.method
        );

        if (!endpoint) {
            throw new RpcException({
                code: 5, // NOT_FOUND
                message: `Endpoint not found: ${data.method} ${data.resource_name}.${data.action}`
            });
        }

        return {
            id: endpoint.id,
            path: endpoint.path,
            method: endpoint.method,
            description: endpoint.description,
            module: endpoint.module,
            is_public: endpoint.isPublic,
            role_codes: endpoint.roles?.map(r => r.roleCode) || [],
            rate_limit_requests: endpoint.rateLimitRequests,
            rate_limit_window: endpoint.rateLimitWindow,
            resource_name: endpoint.resourceName,
            action: endpoint.action
        };
    }

    @GrpcMethod('GatewayConfigService', 'UpdateEndpoint')
    async updateEndpoint(data: any) {
        try {
            console.log('Received UpdateEndpoint data keys:', Object.keys(data));

            // Map snake_case from gRPC to camelCase for service
            const dto = {
                description: data.description,
                module: data.module,
                isPublic: data.is_public,
                roleCodes: data.role_codes,
                rateLimitRequests: data.rate_limit_requests,
                rateLimitWindow: data.rate_limit_window,
                resourceName: data.resource_name,
                action: data.action,
                updatedBy: data.updated_by
            };

            const result = await this.service.update(data.id, dto);
            const endpoint = await this.service.findById(result.id);

            // Sync to Kong after update
            await this.kongSyncService.syncEndpoint(endpoint);

            return this.mapToProto(result);
        } catch (error) {
            console.error('Error in updateEndpoint:', error);
            throw error;
        }
    }

    @GrpcMethod('GatewayConfigService', 'SyncAllToKong')
    async syncAllToKong() {
        const result = await this.kongSyncService.syncAll();
        return {
            success: true,
            synced_count: result.success,
            failed_count: result.total - result.success,
            message: `Synced ${result.success}/${result.total} endpoints`
        };
    }

    private mapToProto(e: any) {
        return {
            id: e.id,
            path: e.path,
            method: e.method,
            description: e.description,
            module: e.module,
            is_public: e.isPublic,
            role_codes: e.roleCodes,
            rate_limit_requests: e.rateLimitRequests,
            rate_limit_window: e.rateLimitWindow,
            resource_name: e.resourceName,
            action: e.action,
            kong_route_id: e.kongRouteId,
            kong_route_name: e.kongRouteName
        };
    }
}
