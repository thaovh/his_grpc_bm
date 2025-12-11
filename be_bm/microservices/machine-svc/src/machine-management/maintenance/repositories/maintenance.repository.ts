import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';
import { MaintenanceRecord } from '../entities/maintenance-record.entity';
import { CreateMaintenanceRecordDto } from '../dto/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from '../dto/update-maintenance-record.dto';

@Injectable()
export class MaintenanceRepository {
    constructor(
        @InjectRepository(MaintenanceRecord)
        private readonly repository: Repository<MaintenanceRecord>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MaintenanceRepository.name);
    }

    async findAll(options?: FindManyOptions<MaintenanceRecord>): Promise<MaintenanceRecord[]> {
        this.logger.info('MaintenanceRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<MaintenanceRecord>): Promise<MaintenanceRecord | null> {
        this.logger.info('MaintenanceRepository#findOne.call', options);
        return this.repository.findOne(options);
    }

    async findById(id: string): Promise<MaintenanceRecord | null> {
        return this.findOne({ where: { id } as any });
    }

    async count(options?: FindManyOptions<MaintenanceRecord>): Promise<number> {
        this.logger.info('MaintenanceRepository#count.call', options);
        return this.repository.count(options);
    }

    async create(dto: CreateMaintenanceRecordDto): Promise<MaintenanceRecord> {
        this.logger.info('MaintenanceRepository#create.call', { machineId: dto.machineId });
        const now = new Date();
        const entity = this.repository.create({
            ...dto,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
            version: 1,
            isActive: 1,
        } as any) as unknown as MaintenanceRecord;
        return this.repository.save(entity);
    }

    async update(id: string, dto: UpdateMaintenanceRecordDto): Promise<MaintenanceRecord> {
        this.logger.info('MaintenanceRepository#update.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MaintenanceRecord not found');

        Object.assign(entity, dto);
        entity.updatedAt = new Date();
        entity.version += 1;

        return this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('MaintenanceRepository#delete.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MaintenanceRecord not found');
        await this.repository.remove(entity);
    }
}
