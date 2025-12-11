import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ManufacturerCountry } from '../entities/manufacturer-country.entity';
import { CreateManufacturerCountryDto } from '../dto/create-manufacturer-country.dto';
import { UpdateManufacturerCountryDto } from '../dto/update-manufacturer-country.dto';

@Injectable()
export class ManufacturerCountryRepository {
    constructor(
        @InjectRepository(ManufacturerCountry)
        private readonly repository: Repository<ManufacturerCountry>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(ManufacturerCountryRepository.name);
    }

    async create(dto: CreateManufacturerCountryDto): Promise<ManufacturerCountry> {
        this.logger.info('ManufacturerCountryRepository#create.call', { code: dto.code, createdBy: dto.createdBy });

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

        const manufacturerCountry = this.repository.create(data);
        await this.repository.save(manufacturerCountry);

        const saved = await this.repository.findOne({ where: { id } as any });
        if (!saved) {
            throw new Error('Failed to fetch created ManufacturerCountry');
        }

        this.logger.info('ManufacturerCountryRepository#create.result', { id: saved.id, code: saved.code });
        return saved;
    }

    async update(id: string, dto: UpdateManufacturerCountryDto): Promise<ManufacturerCountry> {
        this.logger.info('ManufacturerCountryRepository#update.call', { id, updatedBy: dto.updatedBy });

        const entity = await this.repository.findOne({ where: { id } as any });
        if (!entity) {
            throw new Error(`ManufacturerCountry with id ${id} not found`);
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
            throw new Error('Failed to fetch updated ManufacturerCountry');
        }

        this.logger.info('ManufacturerCountryRepository#update.result', { id: updated.id });
        return updated;
    }

    async findAll(options?: FindManyOptions<ManufacturerCountry>): Promise<ManufacturerCountry[]> {
        this.logger.info('ManufacturerCountryRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(id: string): Promise<ManufacturerCountry | null> {
        this.logger.info('ManufacturerCountryRepository#findOne.call', { id });
        return this.repository.findOne({ where: { id } as any });
    }

    async findByCode(code: string): Promise<ManufacturerCountry | null> {
        this.logger.info('ManufacturerCountryRepository#findByCode.call', { code });
        return this.repository.findOne({ where: { code } as any });
    }

    async count(options?: FindManyOptions<ManufacturerCountry>): Promise<number> {
        this.logger.info('ManufacturerCountryRepository#count.call');
        return this.repository.count(options);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('ManufacturerCountryRepository#delete.call', { id });
        await this.repository.delete(id);
    }
}
