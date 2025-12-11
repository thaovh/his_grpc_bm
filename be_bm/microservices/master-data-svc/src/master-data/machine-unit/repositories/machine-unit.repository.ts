import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { MachineUnit } from '../entities/machine-unit.entity';
import { CreateMachineUnitDto } from '../dto/create-machine-unit.dto';
import { UpdateMachineUnitDto } from '../dto/update-machine-unit.dto';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class MachineUnitRepository {
    constructor(
        @InjectRepository(MachineUnit)
        private readonly repository: Repository<MachineUnit>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MachineUnitRepository.name);
    }

    async findAll(options?: FindManyOptions<MachineUnit>): Promise<MachineUnit[]> {
        this.logger.info('MachineUnitRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<MachineUnit>): Promise<MachineUnit | null> {
        this.logger.info('MachineUnitRepository#findOne.call', options);
        return this.repository.findOne(options);
    }

    async findById(id: string): Promise<MachineUnit | null> {
        return this.findOne({ where: { id } as any });
    }

    async findByCode(code: string): Promise<MachineUnit | null> {
        return this.findOne({ where: { code } as any });
    }

    async count(options?: FindManyOptions<MachineUnit>): Promise<number> {
        this.logger.info('MachineUnitRepository#count.call', options);
        return this.repository.count(options);
    }

    async create(dto: CreateMachineUnitDto): Promise<MachineUnit> {
        this.logger.info('MachineUnitRepository#create.call', { code: dto.code });
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

    async update(id: string, dto: UpdateMachineUnitDto): Promise<MachineUnit> {
        this.logger.info('MachineUnitRepository#update.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MachineUnit not found');

        Object.assign(entity, dto);
        entity.updatedAt = new Date();
        entity.version += 1;

        return this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('MachineUnitRepository#delete.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MachineUnit not found');
        await this.repository.remove(entity);
    }
}
