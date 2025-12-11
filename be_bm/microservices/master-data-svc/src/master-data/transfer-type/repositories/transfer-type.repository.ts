import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { TransferType } from '../entities/transfer-type.entity';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TransferTypeRepository {
    constructor(
        @InjectRepository(TransferType)
        private readonly repository: Repository<TransferType>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(TransferTypeRepository.name);
    }

    async findAll(options?: FindManyOptions<TransferType>): Promise<TransferType[]> {
        this.logger.info('TransferTypeRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<TransferType>): Promise<TransferType | null> {
        this.logger.info('TransferTypeRepository#findOne.call', options);
        return this.repository.findOne(options);
    }

    async findById(id: string): Promise<TransferType | null> {
        return this.findOne({ where: { id } as any });
    }

    async findByCode(code: string): Promise<TransferType | null> {
        return this.findOne({ where: { code } as any });
    }

    async count(options?: FindManyOptions<TransferType>): Promise<number> {
        this.logger.info('TransferTypeRepository#count.call', options);
        return this.repository.count(options);
    }

    async create(data: any): Promise<TransferType> {
        this.logger.info('TransferTypeRepository#create.call', { code: data.code });
        const now = new Date();
        const entity = this.repository.create({
            ...data,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
            version: 1,
            isActive: 1,
        });
        return this.repository.save(entity as any);
    }

    async update(id: string, data: any): Promise<TransferType> {
        this.logger.info('TransferTypeRepository#update.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('TransferType not found');

        Object.assign(entity, data);
        entity.updatedAt = new Date();
        entity.version += 1;

        return this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('TransferTypeRepository#delete.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('TransferType not found');
        await this.repository.remove(entity);
    }
}
