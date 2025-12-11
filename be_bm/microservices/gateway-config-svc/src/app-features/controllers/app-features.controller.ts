import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetNavigationTreeQuery } from '../queries/get-navigation-tree.query';
import { GetAppFeaturesQuery } from '../queries/get-app-features.query';
import { CreateAppFeatureCommand, UpdateAppFeatureCommand, DeleteAppFeatureCommand } from '../commands/app-feature.commands';

@Controller()
export class AppFeaturesController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @GrpcMethod('GatewayConfigService', 'GetAppFeatures')
    async getAppFeatures() {
        const features = await this.queryBus.execute(new GetAppFeaturesQuery());
        return { features: features.map(f => this.mapResponse(f)) };
    }

    @GrpcMethod('GatewayConfigService', 'GetNavigationTree')
    async getNavigationTree(data: any) {
        const roleCodes = data.role_codes || data.roleCodes || [];
        const menu = await this.queryBus.execute(new GetNavigationTreeQuery(roleCodes));
        return { menu };
    }

    @GrpcMethod('GatewayConfigService', 'CreateAppFeature')
    async createAppFeature(data: any) {
        const roleCodes = data.role_codes || data.roleCodes || [];
        const parentId = data.parent_id || data.parentId;
        const orderIndex = data.order_index ?? data.orderIndex ?? 0;

        const feature = await this.commandBus.execute(
            new CreateAppFeatureCommand(
                data.code,
                data.name,
                data.icon,
                data.route,
                parentId,
                orderIndex,
                roleCodes,
            ),
        );
        return this.mapResponse(feature);
    }

    @GrpcMethod('GatewayConfigService', 'UpdateAppFeature')
    async updateAppFeature(data: any) {
        const roleCodes = data.role_codes || data.roleCodes;
        const parentId = data.parent_id || data.parentId;
        const orderIndex = data.order_index ?? data.orderIndex;

        const feature = await this.commandBus.execute(
            new UpdateAppFeatureCommand(
                data.id,
                data.name,
                data.icon,
                data.route,
                parentId,
                orderIndex,
                data.is_active,
                roleCodes,
            ),
        );
        return this.mapResponse(feature);
    }

    @GrpcMethod('GatewayConfigService', 'DeleteAppFeature')
    async deleteAppFeature(data: { id: string }) {
        const success = await this.commandBus.execute(new DeleteAppFeatureCommand(data.id));
        return { success, message: success ? 'Deleted successfully' : 'Delete failed' };
    }

    private mapResponse(feature: any) {
        if (!feature) return null;
        return {
            id: feature.id,
            code: feature.code,
            name: feature.name,
            icon: feature.icon,
            route: feature.route,
            parent_id: feature.parentId,
            order_index: feature.orderIndex,
            is_active: feature.isActive === 1,
            role_codes: feature.roles?.map((r: any) => r.roleCode) || [],
        };
    }
}
