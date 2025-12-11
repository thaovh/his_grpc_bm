import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetNotificationTypeByIdQuery } from '../get-notification-type-by-id.query';
import { NotificationTypeRepository } from '../../repositories/notification-type.repository';
import { NotificationType } from '../../entities/notification-type.entity';

@QueryHandler(GetNotificationTypeByIdQuery)
export class GetNotificationTypeByIdHandler implements IQueryHandler<GetNotificationTypeByIdQuery> {
    constructor(
        private readonly repository: NotificationTypeRepository,
    ) { }

    async execute(query: GetNotificationTypeByIdQuery): Promise<NotificationType> {
        return this.repository.findOne(query.id);
    }
}
