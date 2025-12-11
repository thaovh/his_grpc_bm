import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetNotificationTypeByCodeQuery } from '../get-notification-type-by-code.query';
import { NotificationTypeRepository } from '../../repositories/notification-type.repository';
import { NotificationType } from '../../entities/notification-type.entity';

@QueryHandler(GetNotificationTypeByCodeQuery)
export class GetNotificationTypeByCodeHandler implements IQueryHandler<GetNotificationTypeByCodeQuery> {
    constructor(
        private readonly repository: NotificationTypeRepository,
    ) { }

    async execute(query: GetNotificationTypeByCodeQuery): Promise<NotificationType> {
        return this.repository.findByCode(query.code);
    }
}
