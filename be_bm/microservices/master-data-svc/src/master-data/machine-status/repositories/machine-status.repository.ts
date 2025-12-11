import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { MachineStatus } from '../entities/machine-status.entity';
import { CreateMachineStatusDto } from '../dto/create-machine-status.dto';
import { UpdateMachineStatusDto } from '../dto/update-machine-status.dto';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class MachineStatusRepository {
    constructor(
        @InjectRepository(MachineStatus)
        private readonly repository: Repository<MachineStatus>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MachineStatusRepository.name);
    }

    async findAll(options?: FindManyOptions<MachineStatus>): Promise<MachineStatus[]> {
        this.logger.info('MachineStatusRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<MachineStatus>): Promise<MachineStatus | null> {
        this.logger.info('MachineStatusRepository#findOne.call', options);
        return this.repository.findOne(options);
    }

    async findById(id: string): Promise<MachineStatus | null> {
        return this.findOne({ where: { id } as any });
    }

    async findByCode(code: string): Promise<MachineStatus | null> {
        return this.findOne({ where: { code } as any });
    }

    async count(options?: FindManyOptions<MachineStatus>): Promise<number> {
        this.logger.info('MachineStatusRepository#count.call', options);
        return this.repository.count(options);
    }

    async create(dto: CreateMachineStatusDto): Promise<MachineStatus> {
        this.logger.info('MachineStatusRepository#create.call', { code: dto.code });
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

    async update(id: string, dto: UpdateMachineStatusDto): Promise<MachineStatus> {
        this.logger.info('MachineStatusRepository#update.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MachineStatus not found');

        Object.assign(entity, dto);
        entity.updatedAt = new Date();
        entity.version += 1;

        return this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('MachineStatusRepository#delete.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MachineStatus not found');
        await this.repository.remove(entity);
    }
}
