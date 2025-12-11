import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { MaintenanceType } from '../entities/maintenance-type.entity';
import { CreateMaintenanceTypeDto } from '../dto/create-maintenance-type.dto';
import { UpdateMaintenanceTypeDto } from '../dto/update-maintenance-type.dto';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class MaintenanceTypeRepository {
    constructor(
        @InjectRepository(MaintenanceType)
        private readonly repository: Repository<MaintenanceType>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MaintenanceTypeRepository.name);
    }

    async findAll(options?: FindManyOptions<MaintenanceType>): Promise<MaintenanceType[]> {
        this.logger.info('MaintenanceTypeRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<MaintenanceType>): Promise<MaintenanceType | null> {
        this.logger.info('MaintenanceTypeRepository#findOne.call', options);
        return this.repository.findOne(options);
    }

    async findById(id: string): Promise<MaintenanceType | null> {
        return this.findOne({ where: { id } as any });
    }

    async findByCode(code: string): Promise<MaintenanceType | null> {
        return this.findOne({ where: { code } as any });
    }

    async count(options?: FindManyOptions<MaintenanceType>): Promise<number> {
        this.logger.info('MaintenanceTypeRepository#count.call', options);
        return this.repository.count(options);
    }

    async create(dto: CreateMaintenanceTypeDto): Promise<MaintenanceType> {
        this.logger.info('MaintenanceTypeRepository#create.call', { code: dto.code });
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

    async update(id: string, dto: UpdateMaintenanceTypeDto): Promise<MaintenanceType> {
        this.logger.info('MaintenanceTypeRepository#update.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MaintenanceType not found');

        Object.assign(entity, dto);
        entity.updatedAt = new Date();
        entity.version += 1;

        return this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('MaintenanceTypeRepository#delete.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MaintenanceType not found');
        await this.repository.remove(entity);
    }
}
