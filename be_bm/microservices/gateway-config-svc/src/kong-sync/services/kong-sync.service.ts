import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ApiEndpoint } from '../../api-endpoints/entities/api-endpoint.entity';
import { ApiEndpointRepository } from '../../api-endpoints/repositories/api-endpoint.repository';

@Injectable()
export class KongSyncService implements OnModuleInit {
    private readonly logger = new Logger(KongSyncService.name);
    private readonly kongAdminUrl: string;
    private readonly kongServiceId: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly endpointRepository: ApiEndpointRepository,
    ) {
        this.kongAdminUrl = this.configService.get<string>('KONG_ADMIN_URL', 'http://localhost:8001');
        this.kongServiceId = this.configService.get<string>('KONG_SERVICE_ID');
    }

    onModuleInit() {
        if (!this.kongServiceId) {
            this.logger.warn('KONG_SERVICE_ID is not configured. Kong synchronization will fail.');
        }
    }

    async syncEndpoint(endpoint: ApiEndpoint): Promise<void> {
        try {
            this.logger.log(`Syncing endpoint ${endpoint.method} ${endpoint.path} to Kong...`);

            // 1. Create or Update Route
            const route = await this.upsertRoute(endpoint);

            // 2. Update Route ID in DB if changed
            if (endpoint.kongRouteId !== route.id) {
                await this.endpointRepository.updateKongRouteInfo(endpoint.id, route.id, route.name);
            }

            // 3. Clear existing plugins for this route to ensure clean state
            await this.clearRoutePlugins(route.id);

            // 4. Configure Plugins
            await this.configurePlugins(route.id, endpoint);

            this.logger.log(`Successfully synced endpoint ${endpoint.path} (Route ID: ${route.id})`);
        } catch (error) {
            this.logger.error(`Failed to sync endpoint ${endpoint.path} to Kong`, error.stack);
            throw error;
        }
    }

    async syncAll(): Promise<{ success: number; total: number }> {
        this.logger.log('Starting full Kong synchronization...');

        // 1. Get all active endpoints from database (roles loaded by default in repository)
        const endpoints = await this.endpointRepository.findAll({
            where: { isActive: 1 }
        });
        const endpointRouteNames = new Set(endpoints.map(e => `route-${e.id}`));

        // 2. Get all routes from Kong for this service
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.kongAdminUrl}/services/${this.kongServiceId}/routes`)
            );
            const kongRoutes = response.data.data || [];

            // 3. Delete routes that are no longer in database
            let deletedCount = 0;
            for (const kongRoute of kongRoutes) {
                if (!endpointRouteNames.has(kongRoute.name)) {
                    this.logger.log(`Deleting orphaned Kong route: ${kongRoute.name} (${kongRoute.id})`);
                    try {
                        await this.deleteRoute(kongRoute.id);
                        deletedCount++;
                    } catch (error) {
                        this.logger.error(`Failed to delete route ${kongRoute.name}:`, error.message);
                    }
                }
            }

            if (deletedCount > 0) {
                this.logger.log(`Deleted ${deletedCount} orphaned routes from Kong`);
            }
        } catch (error) {
            this.logger.error('Failed to fetch Kong routes for cleanup:', error.message);
            // Continue with sync even if cleanup fails
        }

        // 4. Sync all current endpoints
        let success = 0;
        for (const endpoint of endpoints) {
            try {
                await this.syncEndpoint(endpoint);
                success++;
            } catch (error) {
                this.logger.error(`Error syncing ${endpoint.path}: ${error.message}`);
            }
        }

        this.logger.log(`Kong sync completed: ${success}/${endpoints.length} endpoints synced`);
        return { success, total: endpoints.length };
    }

    async deleteRoute(kongRouteId: string): Promise<void> {
        try {
            await firstValueFrom(
                this.httpService.delete(`${this.kongAdminUrl}/routes/${kongRouteId}`)
            );
            this.logger.log(`Deleted Kong route ${kongRouteId}`);
        } catch (error) {
            if (error.response?.status !== 404) {
                this.logger.error(`Failed to delete Kong route ${kongRouteId}`, error.message);
                throw error;
            }
        }
    }

    private async upsertRoute(endpoint: ApiEndpoint): Promise<any> {
        const routeName = `route-${endpoint.id}`;
        const routeConfig = {
            name: routeName,
            paths: [endpoint.path],
            methods: [endpoint.method],
            strip_path: false,
            service: { id: this.kongServiceId }
        };

        try {
            // Try to find by name first
            const existing = await firstValueFrom(
                this.httpService.get(`${this.kongAdminUrl}/routes/${routeName}`)
            );

            // Update existing
            const response = await firstValueFrom(
                this.httpService.put(`${this.kongAdminUrl}/routes/${routeName}`, routeConfig)
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                // Create new
                const response = await firstValueFrom(
                    this.httpService.post(`${this.kongAdminUrl}/services/${this.kongServiceId}/routes`, routeConfig)
                );
                return response.data;
            }
            throw error;
        }
    }

    private async clearRoutePlugins(routeId: string): Promise<void> {
        const response = await firstValueFrom(
            this.httpService.get(`${this.kongAdminUrl}/routes/${routeId}/plugins`)
        );

        for (const plugin of response.data.data) {
            await firstValueFrom(
                this.httpService.delete(`${this.kongAdminUrl}/plugins/${plugin.id}`)
            );
        }
    }

    private async configurePlugins(routeId: string, endpoint: ApiEndpoint): Promise<void> {
        // DEBUG: Log endpoint info
        this.logger.debug(`Configuring plugins for ${endpoint.path} (${endpoint.method})`);
        this.logger.debug(`  isPublic: ${endpoint.isPublic}`);
        this.logger.debug(`  roles: ${JSON.stringify(endpoint.roles)}`);

        // 1. JWT Plugin (if not public)
        // Note: Authorization (role checking) is now handled by DynamicRolesGuard in API Gateway
        if (!endpoint.isPublic) {
            await this.attachPlugin(routeId, 'jwt', {
                header_names: ['Authorization'],
                cookie_names: [],
                key_claim_name: 'iss',
                claims_to_verify: ['exp'],
                secret_is_base64: false
            });
        }

        // 3. Rate Limiting Plugin
        if (endpoint.rateLimitRequests && endpoint.rateLimitWindow) {
            await this.attachPlugin(routeId, 'rate-limiting', {
                second: endpoint.rateLimitWindow === 'second' ? endpoint.rateLimitRequests : null,
                minute: endpoint.rateLimitWindow === 'minute' ? endpoint.rateLimitRequests : null,
                hour: endpoint.rateLimitWindow === 'hour' ? endpoint.rateLimitRequests : null,
                day: endpoint.rateLimitWindow === 'day' ? endpoint.rateLimitRequests : null,
                policy: 'local'
            });
        }
    }

    private async attachPlugin(routeId: string, name: string, config: any): Promise<void> {
        try {
            await firstValueFrom(
                this.httpService.post(`${this.kongAdminUrl}/routes/${routeId}/plugins`, {
                    name,
                    config,
                    enabled: true
                })
            );
        } catch (error) {
            this.logger.error(`Failed to attach ${name} plugin to route ${routeId}`);
            this.logger.error(`Config: ${JSON.stringify(config)}`);
            this.logger.error(`Kong response: ${JSON.stringify(error.response?.data)}`);
            throw error;
        }
    }
}
