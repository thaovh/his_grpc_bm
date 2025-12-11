
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { NotificationType } from '../entities/notification-type.entity';
import { CreateNotificationTypeDto } from '../dto/create-notification-type.dto';
import { UpdateNotificationTypeDto } from '../dto/update-notification-type.dto';

@Injectable()
export class NotificationTypeRepository {
    constructor(
        @InjectRepository(NotificationType)
        private readonly repository: Repository<NotificationType>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(NotificationTypeRepository.name);
    }

    async create(createDto: CreateNotificationTypeDto): Promise<NotificationType> {
        this.logger.info('NotificationTypeRepository#create.call', { code: createDto.code });
        const { randomUUID } = require('crypto');
        const id = randomUUID();
        const now = new Date();

        const entity = this.repository.create({
            ...createDto,
            id,
            createdAt: now,
            updatedAt: now,
            version: 1,
            isActive: 1,
        });

        return this.repository.save(entity);
    }

    async update(id: string, updateDto: UpdateNotificationTypeDto): Promise<NotificationType> {
        this.logger.info('NotificationTypeRepository#update.call', { id });
        await this.repository.update(id, {
            ...updateDto,
            updatedAt: new Date(),
        });
        return this.repository.findOne({ where: { id } });
    }

    async findAll(options?: FindManyOptions<NotificationType>): Promise<NotificationType[]> {
        this.logger.info('NotificationTypeRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(id: string): Promise<NotificationType | null> {
        this.logger.info('NotificationTypeRepository#findOne.call', { id });
        return this.repository.findOne({ where: { id } });
    }

    async findByCode(code: string): Promise<NotificationType | null> {
        this.logger.info('NotificationTypeRepository#findByCode.call', { code });
        return this.repository.findOne({ where: { code } });
    }

    async findAndCount(options?: FindManyOptions<NotificationType>): Promise<[NotificationType[], number]> {
        this.logger.info('NotificationTypeRepository#findAndCount.call', options);
        return this.repository.findAndCount(options);
    }

    async count(options?: FindManyOptions<NotificationType>): Promise<number> {
        this.logger.info('NotificationTypeRepository#count.call', options);
        return this.repository.count(options);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('NotificationTypeRepository#delete.call', { id });
        await this.repository.delete(id);
    }
}
