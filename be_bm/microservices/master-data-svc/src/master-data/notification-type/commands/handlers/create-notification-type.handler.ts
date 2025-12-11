import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationTypeCommand } from '../create-notification-type.command';
import { NotificationTypeRepository } from '../../repositories/notification-type.repository';
import { NotificationType } from '../../entities/notification-type.entity';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

@CommandHandler(CreateNotificationTypeCommand)
export class CreateNotificationTypeHandler implements ICommandHandler<CreateNotificationTypeCommand> {
    constructor(
        private readonly repository: NotificationTypeRepository,
    ) { }

    async execute(command: CreateNotificationTypeCommand): Promise<NotificationType> {
        const { code, name, sortOrder, description } = command;

        const existing = await this.repository.findByCode(code);
        if (existing) {
            throw new RpcException({
                code: grpc.status.ALREADY_EXISTS,
                message: 'Notification Type Code already exists',
            });
        }

        return this.repository.create({
            code,
            name,
            sortOrder,
            description,
        });
    }
}
