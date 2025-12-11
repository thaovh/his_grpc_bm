import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { MachineCategory } from '../entities/machine-category.entity';
import { CreateMachineCategoryDto } from '../dto/create-machine-category.dto';
import { UpdateMachineCategoryDto } from '../dto/update-machine-category.dto';

@Injectable()
export class MachineCategoryRepository {
    constructor(
        @InjectRepository(MachineCategory)
        private readonly repository: Repository<MachineCategory>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MachineCategoryRepository.name);
    }

    async create(dto: CreateMachineCategoryDto): Promise<MachineCategory> {
        this.logger.info('MachineCategoryRepository#create.call', { code: dto.code, createdBy: dto.createdBy });

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

        const entity = this.repository.create(data);
        await this.repository.save(entity);

        const saved = await this.repository.findOne({ where: { id } as any });
        if (!saved) {
            throw new Error('Failed to fetch created MachineCategory');
        }

        this.logger.info('MachineCategoryRepository#create.result', { id: saved.id, code: saved.code });
        return saved;
    }

    async update(id: string, dto: UpdateMachineCategoryDto): Promise<MachineCategory> {
        this.logger.info('MachineCategoryRepository#update.call', { id, updatedBy: dto.updatedBy });

        const entity = await this.repository.findOne({ where: { id } as any });
        if (!entity) {
            throw new Error(`MachineCategory with id ${id} not found`);
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

        const updated = await this.repository.findOne({ where: { id } as any });
        if (!updated) {
            throw new Error('Failed to fetch updated MachineCategory');
        }

        this.logger.info('MachineCategoryRepository#update.result', { id: updated.id });
        return updated;
    }

    async findAll(options?: FindManyOptions<MachineCategory>): Promise<MachineCategory[]> {
        this.logger.info('MachineCategoryRepository#findAll.call', options);
        return this.repository.find({
            ...options,
            order: options?.order || { sortOrder: 'ASC', name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<MachineCategory | null> {
        this.logger.info('MachineCategoryRepository#findOne.call', { id });
        return this.repository.findOne({ where: { id } as any });
    }

    async findByCode(code: string): Promise<MachineCategory | null> {
        this.logger.info('MachineCategoryRepository#findByCode.call', { code });
        return this.repository.findOne({ where: { code } as any });
    }

    async count(options?: FindManyOptions<MachineCategory>): Promise<number> {
        this.logger.info('MachineCategoryRepository#count.call');
        return this.repository.count(options);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('MachineCategoryRepository#delete.call', { id });
        await this.repository.delete(id);
    }
}
