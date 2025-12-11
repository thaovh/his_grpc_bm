import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { TransferStatus } from '../entities/transfer-status.entity';
import { CreateTransferStatusDto } from '../dto/create-transfer-status.dto';
import { UpdateTransferStatusDto } from '../dto/update-transfer-status.dto';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TransferStatusRepository {
    constructor(
        @InjectRepository(TransferStatus)
        private readonly repository: Repository<TransferStatus>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(TransferStatusRepository.name);
    }

    async findAll(options?: FindManyOptions<TransferStatus>): Promise<TransferStatus[]> {
        this.logger.info('TransferStatusRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<TransferStatus>): Promise<TransferStatus | null> {
        this.logger.info('TransferStatusRepository#findOne.call', options);
        return this.repository.findOne(options);
    }

    async findById(id: string): Promise<TransferStatus | null> {
        return this.findOne({ where: { id } as any });
    }

    async findByCode(code: string): Promise<TransferStatus | null> {
        return this.findOne({ where: { code } as any });
    }

    async count(options?: FindManyOptions<TransferStatus>): Promise<number> {
        this.logger.info('TransferStatusRepository#count.call', options);
        return this.repository.count(options);
    }

    async create(dto: CreateTransferStatusDto): Promise<TransferStatus> {
        this.logger.info('TransferStatusRepository#create.call', { code: dto.code });
        const now = new Date();
        const entity = this.repository.create({
            ...dto,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
            version: 1,
            isActive: 1,
        });
        return this.repository.save(entity);
    }

    async update(id: string, dto: UpdateTransferStatusDto): Promise<TransferStatus> {
        this.logger.info('TransferStatusRepository#update.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('TransferStatus not found');

        Object.assign(entity, dto);
        entity.updatedAt = new Date();
        entity.version += 1;

        return this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('TransferStatusRepository#delete.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('TransferStatus not found');
        await this.repository.remove(entity);
    }
}
