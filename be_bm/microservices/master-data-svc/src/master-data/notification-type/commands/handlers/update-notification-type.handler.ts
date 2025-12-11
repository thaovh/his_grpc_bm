import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateNotificationTypeCommand } from '../update-notification-type.command';
import { NotificationTypeRepository } from '../../repositories/notification-type.repository';
import { NotificationType } from '../../entities/notification-type.entity';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';

@CommandHandler(UpdateNotificationTypeCommand)
export class UpdateNotificationTypeHandler implements ICommandHandler<UpdateNotificationTypeCommand> {
    constructor(
        private readonly repository: NotificationTypeRepository,
    ) { }

    async execute(command: UpdateNotificationTypeCommand): Promise<NotificationType> {
        const { id, code, name, sortOrder, description } = command;

        const notificationType = await this.repository.findOne(id);
        if (!notificationType) {
            throw new RpcException({
                code: grpc.status.NOT_FOUND,
                message: 'Notification Type not found',
            });
        }

        if (code && code !== notificationType.code) {
            const existing = await this.repository.findByCode(code);
            if (existing) {
                throw new RpcException({
                    code: grpc.status.ALREADY_EXISTS,
                    message: 'Notification Type Code already exists',
                });
            }
        }

        // Prepare simple DTO provided to update method
        const updateDto: any = {};
        if (code) updateDto.code = code;
        if (name) updateDto.name = name;
        if (sortOrder !== undefined) updateDto.sortOrder = sortOrder;
        if (description !== undefined) updateDto.description = description;

        return this.repository.update(id, updateDto);
    }
}
