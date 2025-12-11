import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface GatewayConfigGrpcService {
    getEndpoints(data: any): any;
    getEndpointByPath(data: any): any;
    getEndpointByResource(data: any): any;
    createEndpoint(data: any): any;
    updateEndpoint(data: any): any;
    deleteEndpoint(data: any): any;
    syncToKong(data: any): any;
    syncAllToKong(data: any): any;
    getNavigationTree(data: { role_codes: string[] }): any;
    getAppFeatures(data: any): any;
    createAppFeature(data: any): any;
    updateAppFeature(data: any): any;
    deleteAppFeature(data: { id: string }): any;
}

@Injectable()
export class GatewayConfigService implements OnModuleInit {
    private readonly logger = new Logger(GatewayConfigService.name);
    private gRpcService: GatewayConfigGrpcService;

    constructor(@Inject('GATEWAY_CONFIG_PACKAGE') private client: ClientGrpc) { }

    onModuleInit() {
        this.gRpcService = this.client.getService<GatewayConfigGrpcService>('GatewayConfigService');
    }

    async findAll(module?: string) {
        try {
            const response: any = await firstValueFrom(this.gRpcService.getEndpoints({ module }));
            return response.endpoints || [];
        } catch (error) {
            this.logger.error(`Error finding all endpoints: ${error.message}`);
            throw error;
        }
    }

    async findByPath(path: string, method: string) {
        try {
            return await firstValueFrom(this.gRpcService.getEndpointByPath({ path, method }));
        } catch (error) {
            this.logger.error(`Error finding endpoint by path: ${error.message}`);
            throw error;
        }
    }

    // Alias for DynamicRolesGuard
    async getEndpointByPath(path: string, method: string) {
        return this.findByPath(path, method);
    }

    async getEndpointByResource(resourceName: string, action: string, method: string) {
        try {
            return await firstValueFrom(
                this.gRpcService.getEndpointByResource({ 
                    resource_name: resourceName, 
                    action, 
                    method 
                })
            );
        } catch (error) {
            this.logger.error(`Error finding endpoint by resource: ${error.message}`);
            throw error;
        }
    }

    async create(data: any) {
        try {
            return await firstValueFrom(this.gRpcService.createEndpoint(data));
        } catch (error) {
            this.logger.error(`Error creating endpoint: ${error.message}`);
            throw error;
        }
    }

    async update(data: any) {
        try {
            return await firstValueFrom(this.gRpcService.updateEndpoint(data));
        } catch (error) {
            this.logger.error(`Error updating endpoint: ${error.message}`);
            throw error;
        }
    }

    async delete(id: string) {
        try {
            return await firstValueFrom(this.gRpcService.deleteEndpoint({ id }));
        } catch (error) {
            this.logger.error(`Error deleting endpoint: ${error.message}`);
            throw error;
        }
    }

    async syncAll() {
        try {
            return await firstValueFrom(this.gRpcService.syncAllToKong({}));
        } catch (error) {
            this.logger.error(`Error syncing all to Kong: ${error.message}`);
            throw error;
        }
    }

    async getNavigationTree(roleCodes: string[]) {
        try {
            const response: any = await firstValueFrom(this.gRpcService.getNavigationTree({ role_codes: roleCodes }));
            return response.menu || [];
        } catch (error) {
            this.logger.error(`Error getting navigation tree: ${error.message}`);
            throw error;
        }
    }

    async findAllFeatures() {
        try {
            const response: any = await firstValueFrom(this.gRpcService.getAppFeatures({}));
            return response.features || [];
        } catch (error) {
            this.logger.error(`Error finding all features: ${error.message}`);
            throw error;
        }
    }

    async createFeature(data: any) {
        try {
            // Map camelCase (DTO) to snake_case (gRPC proto)
            const grpcData = {
                code: data.code,
                name: data.name,
                icon: data.icon,
                route: data.route,
                parent_id: data.parentId,
                order_index: data.orderIndex,
                role_codes: data.roleCodes,
                created_by: data.createdBy
            };
            return await firstValueFrom(this.gRpcService.createAppFeature(grpcData));
        } catch (error) {
            this.logger.error(`Error creating feature: ${error.message}`);
            throw error;
        }
    }

    async updateFeature(data: any) {
        try {
            // Map camelCase (DTO) to snake_case (gRPC proto)
            const grpcData = {
                id: data.id,
                name: data.name,
                icon: data.icon,
                route: data.route,
                parent_id: data.parentId,
                order_index: data.orderIndex,
                is_active: data.isActive,
                role_codes: data.roleCodes
            };
            return await firstValueFrom(this.gRpcService.updateAppFeature(grpcData));
        } catch (error) {
            this.logger.error(`Error updating feature: ${error.message}`);
            throw error;
        }
    }

    async deleteFeature(id: string) {
        try {
            return await firstValueFrom(this.gRpcService.deleteAppFeature({ id }));
        } catch (error) {
            this.logger.error(`Error deleting feature: ${error.message}`);
            throw error;
        }
    }
}
