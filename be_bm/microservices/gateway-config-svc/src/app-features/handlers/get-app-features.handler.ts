import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAppFeaturesQuery } from '../queries/get-app-features.query';
import { AppFeature } from '../entities/app-feature.entity';

@QueryHandler(GetAppFeaturesQuery)
export class GetAppFeaturesHandler implements IQueryHandler<GetAppFeaturesQuery> {
    constructor(
        @InjectRepository(AppFeature)
        private readonly featureRepo: Repository<AppFeature>,
    ) { }

    async execute(query: GetAppFeaturesQuery): Promise<AppFeature[]> {
        return this.featureRepo.find({
            where: { isActive: 1 },
            relations: ['roles'],
            order: { orderIndex: 'ASC' }
        });
    }
}
