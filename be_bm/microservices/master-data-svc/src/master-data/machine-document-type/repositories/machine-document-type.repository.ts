import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { MachineDocumentType } from '../entities/machine-document-type.entity';
import { CreateMachineDocumentTypeDto } from '../dto/create-machine-document-type.dto';
import { UpdateMachineDocumentTypeDto } from '../dto/update-machine-document-type.dto';

@Injectable()
export class MachineDocumentTypeRepository {
    constructor(
        @InjectRepository(MachineDocumentType)
        private readonly repository: Repository<MachineDocumentType>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MachineDocumentTypeRepository.name);
    }

    async create(dto: CreateMachineDocumentTypeDto): Promise<MachineDocumentType> {
        this.logger.info('MachineDocumentTypeRepository#create.call', { code: dto.code, createdBy: dto.createdBy });

        const { randomUUID } = require('crypto');
        const id = randomUUID();
        const now = new Date();

        const data: any = {
            id,
            code: dto.code,
            name: dto.name,
            sortOrder: dto.sortOrder ?? 0,
            isRequired: dto.isRequired ?? 0,
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
            throw new Error('Failed to fetch created MachineDocumentType');
        }

        this.logger.info('MachineDocumentTypeRepository#create.result', { id: saved.id, code: saved.code });
        return saved;
    }

    async update(id: string, dto: UpdateMachineDocumentTypeDto): Promise<MachineDocumentType> {
        this.logger.info('MachineDocumentTypeRepository#update.call', { id, updatedBy: dto.updatedBy });

        const entity = await this.repository.findOne({ where: { id } as any });
        if (!entity) {
            throw new Error(`MachineDocumentType with id ${id} not found`);
        }

        if (dto.code !== undefined) entity.code = dto.code;
        if (dto.name !== undefined) entity.name = dto.name;
        if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder ?? 0;
        if (dto.isRequired !== undefined) entity.isRequired = dto.isRequired ?? 0;
        if (dto.updatedBy !== undefined && dto.updatedBy !== null) {
            entity.updatedBy = dto.updatedBy;
        }

        entity.updatedAt = new Date();
        entity.version += 1;

        await this.repository.save(entity);

        const updated = await this.repository.findOne({ where: { id } as any });
        if (!updated) {
            throw new Error('Failed to fetch updated MachineDocumentType');
        }

        this.logger.info('MachineDocumentTypeRepository#update.result', { id: updated.id });
        return updated;
    }

    async findAll(options?: FindManyOptions<MachineDocumentType>): Promise<MachineDocumentType[]> {
        this.logger.info('MachineDocumentTypeRepository#findAll.call', options);
        return this.repository.find({
            ...options,
            order: options?.order || { sortOrder: 'ASC', name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<MachineDocumentType | null> {
        this.logger.info('MachineDocumentTypeRepository#findOne.call', { id });
        return this.repository.findOne({ where: { id } as any });
    }

    async findByCode(code: string): Promise<MachineDocumentType | null> {
        this.logger.info('MachineDocumentTypeRepository#findByCode.call', { code });
        return this.repository.findOne({ where: { code } as any });
    }

    async count(options?: FindManyOptions<MachineDocumentType>): Promise<number> {
        this.logger.info('MachineDocumentTypeRepository#count.call');
        return this.repository.count(options);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('MachineDocumentTypeRepository#delete.call', { id });
        await this.repository.delete(id);
    }
}
