import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteAppFeatureCommand } from '../commands/app-feature.commands';
import { AppFeature } from '../entities/app-feature.entity';
import { AppFeatureRole } from '../entities/app-feature-role.entity';

@CommandHandler(DeleteAppFeatureCommand)
export class DeleteAppFeatureHandler implements ICommandHandler<DeleteAppFeatureCommand> {
    constructor(
        @InjectRepository(AppFeature)
        private readonly featureRepository: Repository<AppFeature>,
        @InjectRepository(AppFeatureRole)
        private readonly roleRepository: Repository<AppFeatureRole>,
    ) { }

    async execute(command: DeleteAppFeatureCommand): Promise<boolean> {
        // Delete roles first
        await this.roleRepository.delete({ appFeatureId: command.id });

        // Delete feature
        const result = await this.featureRepository.delete(command.id);

        return result.affected > 0;
    }
}
