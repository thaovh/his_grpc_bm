import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetNotificationTypesQuery } from '../get-notification-types.query';
import { NotificationTypeRepository } from '../../repositories/notification-type.repository';
import { NotificationType } from '../../entities/notification-type.entity';

@QueryHandler(GetNotificationTypesQuery)
export class GetNotificationTypesHandler implements IQueryHandler<GetNotificationTypesQuery> {
    constructor(
        private readonly repository: NotificationTypeRepository,
    ) { }

    async execute(query: GetNotificationTypesQuery): Promise<NotificationType[]> {
        const { offset, limit, where, order } = query;

        const [data, count] = await this.repository.findAndCount({
            skip: offset,
            take: limit,
            where: where || {},
            order: order || { sortOrder: 'ASC', createdAt: 'DESC' },
        });

        return data;
    }
}
