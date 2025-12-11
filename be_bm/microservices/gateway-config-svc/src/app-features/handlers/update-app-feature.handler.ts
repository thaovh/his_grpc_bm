import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UpdateAppFeatureCommand } from '../commands/app-feature.commands';
import { AppFeature } from '../entities/app-feature.entity';
import { AppFeatureRole } from '../entities/app-feature-role.entity';

@CommandHandler(UpdateAppFeatureCommand)
export class UpdateAppFeatureHandler implements ICommandHandler<UpdateAppFeatureCommand> {
    constructor(
        @InjectRepository(AppFeature)
        private readonly featureRepository: Repository<AppFeature>,
        private readonly dataSource: DataSource,
    ) { }

    async execute(command: UpdateAppFeatureCommand): Promise<AppFeature> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const feature = await queryRunner.manager.findOne(AppFeature, {
                where: { id: command.id },
            });

            if (!feature) {
                throw new Error('App Feature not found');
            }

            if (command.name !== undefined) feature.name = command.name;
            if (command.icon !== undefined) feature.icon = command.icon;
            if (command.route !== undefined) feature.route = command.route;
            if (command.parentId !== undefined) feature.parentId = command.parentId;
            if (command.orderIndex !== undefined) feature.orderIndex = command.orderIndex;
            if (command.isActive !== undefined) feature.isActive = command.isActive ? 1 : 0;

            await queryRunner.manager.save(feature);

            if (command.roleCodes !== undefined) {
                // Delete old roles
                await queryRunner.manager.delete(AppFeatureRole, { appFeatureId: command.id });

                // Add new roles
                if (command.roleCodes.length > 0) {
                    const roles = command.roleCodes.map((roleCode) => {
                        return queryRunner.manager.create(AppFeatureRole, {
                            appFeatureId: command.id,
                            roleCode,
                        });
                    });
                    await queryRunner.manager.save(roles);
                }
            }

            await queryRunner.commitTransaction();

            return this.featureRepository.findOne({
                where: { id: command.id },
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
