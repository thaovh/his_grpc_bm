import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateAppFeatureCommand } from '../commands/app-feature.commands';
import { AppFeature } from '../entities/app-feature.entity';
import { AppFeatureRole } from '../entities/app-feature-role.entity';

@CommandHandler(CreateAppFeatureCommand)
export class CreateAppFeatureHandler implements ICommandHandler<CreateAppFeatureCommand> {
    constructor(
        @InjectRepository(AppFeature)
        private readonly featureRepository: Repository<AppFeature>,
        private readonly dataSource: DataSource,
    ) { }

    async execute(command: CreateAppFeatureCommand): Promise<AppFeature> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            // Check if feature already exists by code
            let feature = await queryRunner.manager.findOne(AppFeature, {
                where: { code: command.code },
            });

            if (feature) {
                // Update existing feature
                feature.name = command.name;
                feature.icon = command.icon;
                feature.route = command.route;
                feature.parentId = command.parentId;
                feature.orderIndex = command.orderIndex;
                feature.isActive = 1;
                feature.updatedAt = new Date();
                feature.version += 1;
            } else {
                // Create new feature
                feature = this.featureRepository.create({
                    code: command.code,
                    name: command.name,
                    icon: command.icon,
                    route: command.route,
                    parentId: command.parentId,
                    orderIndex: command.orderIndex,
                    isActive: 1,
                });
            }

            const savedFeature = await queryRunner.manager.save(feature);

            // Delete existing roles before adding new ones (Sync roles)
            await queryRunner.manager.delete(AppFeatureRole, { appFeatureId: savedFeature.id });

            if (command.roleCodes && command.roleCodes.length > 0) {
                const roles = command.roleCodes.map((roleCode) => {
                    return queryRunner.manager.create(AppFeatureRole, {
                        appFeatureId: savedFeature.id,
                        roleCode,
                    });
                });
                await queryRunner.manager.save(roles);
            }

            await queryRunner.commitTransaction();

            // Reload with relations
            return this.featureRepository.findOne({
                where: { id: savedFeature.id },
                relations: ['roles'],
            });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
