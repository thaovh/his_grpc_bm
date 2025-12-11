import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CountNotificationTypesQuery } from '../count-notification-types.query';
import { NotificationTypeRepository } from '../../repositories/notification-type.repository';

@QueryHandler(CountNotificationTypesQuery)
export class CountNotificationTypesHandler implements IQueryHandler<CountNotificationTypesQuery> {
    constructor(
        private readonly repository: NotificationTypeRepository,
    ) { }

    async execute(query: CountNotificationTypesQuery): Promise<{ count: number }> {
        const count = await this.repository.count({
            where: query.where || {},
        });
        return { count };
    }
}
