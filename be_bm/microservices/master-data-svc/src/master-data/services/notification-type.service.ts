import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

import { CreateNotificationTypeCommand } from '../notification-type/commands/create-notification-type.command';
import { UpdateNotificationTypeCommand } from '../notification-type/commands/update-notification-type.command';
import { DeleteNotificationTypeCommand } from '../notification-type/commands/delete-notification-type.command';
import { GetNotificationTypesQuery } from '../notification-type/queries/get-notification-types.query';
import { GetNotificationTypeByIdQuery } from '../notification-type/queries/get-notification-type-by-id.query';
import { GetNotificationTypeByCodeQuery } from '../notification-type/queries/get-notification-type-by-code.query';
import { CountNotificationTypesQuery } from '../notification-type/queries/count-notification-types.query';
import { NotificationType } from '../notification-type/entities/notification-type.entity';

@Injectable()
export class NotificationTypeService {
    private readonly logger = new Logger(NotificationTypeService.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    async create(data: any): Promise<NotificationType> {
        this.logger.log(`Creating Notification Type: ${JSON.stringify(data)}`);
        return this.commandBus.execute(
            new CreateNotificationTypeCommand(data.code, data.name, data.sortOrder, data.description)
        );
    }

    async update(data: any): Promise<NotificationType> {
        this.logger.log(`Updating Notification Type: ${data.id}`);
        return this.commandBus.execute(
            new UpdateNotificationTypeCommand(data.id, data.code, data.name, data.sortOrder, data.description)
        );
    }

    async delete(query: any): Promise<any> {
        this.logger.log(`Deleting Notification Type: ${JSON.stringify(query)}`);
        // parsing Query object same as Handler logic, or just passing it
        // Usually controller passes Query object { where: "..." }
        let id, code;
        try {
            if (query.where) {
                const where = JSON.parse(query.where);
                id = where.id;
                code = where.code;
            }
        } catch (e) { }

        return this.commandBus.execute(new DeleteNotificationTypeCommand(id, code));
    }

    async findAll(query: any): Promise<any> {
        let offset, limit, where, order;
        try {
            if (query.offset) offset = query.offset;
            if (query.limit) limit = query.limit;
            if (query.where) where = JSON.parse(query.where);
            if (query.order) order = JSON.parse(query.order);
        } catch (error) {
            this.logger.error(error);
        }

        return this.queryBus.execute(new GetNotificationTypesQuery(offset, limit, where, order));
    }

    async findOne(id: string): Promise<NotificationType> {
        return this.queryBus.execute(new GetNotificationTypeByIdQuery(id));
    }

    async findByCode(code: string): Promise<NotificationType> {
        return this.queryBus.execute(new GetNotificationTypeByCodeQuery(code));
    }

    async count(query: any): Promise<any> {
        let where;
        try {
            if (query.where) where = JSON.parse(query.where);
        } catch (error) { }
        return this.queryBus.execute(new CountNotificationTypesQuery(where));
    }
}
