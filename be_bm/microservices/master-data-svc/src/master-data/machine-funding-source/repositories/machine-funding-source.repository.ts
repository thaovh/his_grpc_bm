import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { MachineFundingSource } from '../entities/machine-funding-source.entity';
import { CreateMachineFundingSourceDto } from '../dto/create-machine-funding-source.dto';
import { UpdateMachineFundingSourceDto } from '../dto/update-machine-funding-source.dto';

@Injectable()
export class MachineFundingSourceRepository {
    constructor(
        @InjectRepository(MachineFundingSource)
        private readonly repository: Repository<MachineFundingSource>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MachineFundingSourceRepository.name);
    }

    async create(dto: CreateMachineFundingSourceDto): Promise<MachineFundingSource> {
        this.logger.info('MachineFundingSourceRepository#create.call', { code: dto.code, createdBy: dto.createdBy });

        const { randomUUID } = require('crypto');
        const id = randomUUID();
        const now = new Date();

        const data: any = {
            id,
            code: dto.code,
            name: dto.name,
            sortOrder: dto.sortOrder ?? 0,
            isActive: 1,
            version: 1,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            createdBy: dto.createdBy ?? null,
            updatedBy: dto.createdBy ?? null,
        };

        const machineFundingSource = this.repository.create(data);
        await this.repository.save(machineFundingSource);

        const saved = await this.repository.findOne({ where: { id } });
        if (!saved) {
            throw new Error('Failed to fetch created MachineFundingSource');
        }

        this.logger.info('MachineFundingSourceRepository#create.result', { id: saved.id, code: saved.code });
        return saved;
    }

    async update(id: string, dto: UpdateMachineFundingSourceDto): Promise<MachineFundingSource> {
        this.logger.info('MachineFundingSourceRepository#update.call', { id, updatedBy: dto.updatedBy });

        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) {
            throw new Error(`MachineFundingSource with id ${id} not found`);
        }

        if (dto.code !== undefined) entity.code = dto.code;
        if (dto.name !== undefined) entity.name = dto.name;
        if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder ?? 0;
        if (dto.updatedBy !== undefined && dto.updatedBy !== null) {
            entity.updatedBy = dto.updatedBy;
        }

        entity.updatedAt = new Date();
        entity.version += 1;

        await this.repository.save(entity);

        const updated = await this.repository.findOne({ where: { id } });
        if (!updated) {
            throw new Error('Failed to fetch updated MachineFundingSource');
        }

        this.logger.info('MachineFundingSourceRepository#update.result', { id: updated.id });
        return updated;
    }

    async findAll(options?: FindManyOptions<MachineFundingSource>): Promise<MachineFundingSource[]> {
        this.logger.info('MachineFundingSourceRepository#findAll.call', options);
        const result = await this.repository.find({
            ...options,
            order: options?.order || { sortOrder: 'ASC', name: 'ASC' },
        });
        this.logger.info('MachineFundingSourceRepository#findAll.result', { count: result.length });
        return result;
    }

    async findOne(id: string): Promise<MachineFundingSource | null> {
        return this.repository.findOne({ where: { id } });
    }

    async findByCode(code: string): Promise<MachineFundingSource | null> {
        return this.repository.findOne({ where: { code } });
    }

    async count(options?: FindManyOptions<MachineFundingSource>): Promise<number> {
        return this.repository.count(options);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
