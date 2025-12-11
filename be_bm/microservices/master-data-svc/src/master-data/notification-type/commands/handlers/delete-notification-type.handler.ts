import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteNotificationTypeCommand } from '../delete-notification-type.command';
import { NotificationTypeRepository } from '../../repositories/notification-type.repository';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

@CommandHandler(DeleteNotificationTypeCommand)
export class DeleteNotificationTypeHandler implements ICommandHandler<DeleteNotificationTypeCommand> {
    constructor(
        private readonly repository: NotificationTypeRepository,
    ) { }

    async execute(command: DeleteNotificationTypeCommand): Promise<any> {
        const { id } = command;
        // Simple implementation: delete by id
        await this.repository.delete(id);
        return { count: 1 };
    }
}
