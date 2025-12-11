import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { GetNavigationTreeQuery } from '../queries/get-navigation-tree.query';
import { AppFeature } from '../entities/app-feature.entity';

@QueryHandler(GetNavigationTreeQuery)
export class GetNavigationTreeHandler implements IQueryHandler<GetNavigationTreeQuery> {
    constructor(
        @InjectRepository(AppFeature)
        private readonly featureRepository: Repository<AppFeature>,
    ) { }

    async execute(query: GetNavigationTreeQuery): Promise<any[]> {
        const { roleCodes } = query;
        const logger = new Logger(GetNavigationTreeHandler.name);

        try {
            logger.log(`[DEBUG] GetNavigationTree - Roles from token: ${JSON.stringify(roleCodes)}`);

            if (!roleCodes || roleCodes.length === 0) {
                logger.warn('[DEBUG] GetNavigationTree - No role codes provided.');
                return [];
            }

            // 1. Fetch features with roles using QueryBuilder for explicit join control
            // Oracle can be sensitive to specific join types in TypeORM find()
            const features = await this.featureRepository
                .createQueryBuilder('feature')
                .leftJoinAndSelect('feature.roles', 'role')
                .where('feature.isActive = :isActive', { isActive: 1 })
                .andWhere('role.roleCode IN (:...roleCodes)', { roleCodes })
                .orderBy('feature.orderIndex', 'ASC')
                .getMany();

            logger.log(`[DEBUG] GetNavigationTree - Found ${features.length} feature instances in DB.`);

            if (features.length === 0) {
                // Let's check if there are ANY active features at all (for debugging)
                const anyFeatures = await this.featureRepository.count({ where: { isActive: 1 } });
                logger.warn(`[DEBUG] GetNavigationTree - No matches for roles. Total active features in DB: ${anyFeatures}`);
            }

            // Deduplicate (QueryBuilder with leftJoinAndSelect and IN might return same feature ID multiple times)
            const uniqueFeaturesMap = new Map<string, AppFeature>();
            features.forEach(f => {
                if (!uniqueFeaturesMap.has(f.id)) {
                    uniqueFeaturesMap.set(f.id, f);
                } else {
                    // Merge roles if duplicate feature found due to multiple role matches
                    const existing = uniqueFeaturesMap.get(f.id);
                    const newRoles = f.roles || [];
                    existing.roles = [...(existing.roles || []), ...newRoles];
                }
            });
            const uniqueFeatures = Array.from(uniqueFeaturesMap.values());

            logger.log(`[DEBUG] GetNavigationTree - Processed ${uniqueFeatures.length} unique features.`);

            const tree = this.buildTree(uniqueFeatures);
            logger.log(`[DEBUG] GetNavigationTree - Built tree with ${tree.length} top-level nodes.`);

            return tree;
        } catch (error) {
            logger.error(`[DEBUG] GetNavigationTree - Error: ${error.message}`, error.stack);
            throw error;
        }
    }

    private buildTree(features: AppFeature[], parentId: string | null = null): any[] {
        const tree = [];

        for (const feature of features) {
            // Check if feature belongs to the current parent level
            const isRootSearch = !parentId || parentId === '';
            const featureParentId = feature.parentId || null;

            const isMatch = isRootSearch
                ? (featureParentId === null || featureParentId === '')
                : (featureParentId === parentId);

            if (isMatch) {
                const children = this.buildTree(features, feature.id);
                tree.push({
                    id: feature.id,
                    code: feature.code,
                    name: feature.name,
                    icon: feature.icon || '',
                    route: feature.route || '',
                    parent_id: feature.parentId || '',
                    order_index: feature.orderIndex || 0,
                    is_active: feature.isActive === 1,
                    role_codes: Array.from(new Set(feature.roles?.map(r => r.roleCode) || [])),
                    children: children,
                });
            }
        }

        return tree;
    }
}
