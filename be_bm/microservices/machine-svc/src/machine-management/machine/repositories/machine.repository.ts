import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';
import { RpcException } from '@nestjs/microservices';
import { Machine } from '../entities/machine.entity';
import { CreateMachineDto } from '../dto/create-machine.dto';
import { UpdateMachineDto } from '../dto/update-machine.dto';

@Injectable()
export class MachineRepository {
    constructor(
        @InjectRepository(Machine)
        private readonly repository: Repository<Machine>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MachineRepository.name);
    }

    async findAll(options?: FindManyOptions<Machine>): Promise<Machine[]> {
        this.logger.info('MachineRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<Machine>): Promise<Machine | null> {
        this.logger.info('MachineRepository#findOne.call', options);
        return this.repository.findOne(options);
    }

    async findById(id: string): Promise<Machine | null> {
        return this.findOne({ where: { id } as any });
    }

    async findByCode(code: string): Promise<Machine | null> {
        return this.findOne({ where: { code } as any });
    }

    async count(options?: FindManyOptions<Machine>): Promise<number> {
        this.logger.info('MachineRepository#count.call', options);
        return this.repository.count(options);
    }

    async create(dto: any): Promise<Machine> {
        this.logger.info('MachineRepository#create.call', { code: dto.code });

        // 1. Check if code already exists to provide better error message
        const existing = await this.findByCode(dto.code);
        if (existing) {
            this.logger.warn('MachineRepository#create.alreadyExists', { code: dto.code });
            throw new RpcException({
                code: 6, // ALREADY_EXISTS
                message: `Machine with code ${dto.code} already exists`,
            });
        }

        const now = new Date();
        const { branchId, departmentId, managementDepartmentId, transferDate, transferTypeId, ...machineData } = dto;
        const entity = this.repository.create({
            ...machineData,
            branchId,
            departmentId,
            managementDepartmentId,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
            version: 1,
            isActive: 1,
        } as any) as unknown as Machine;
        return this.repository.save(entity);
    }

    async update(id: string, dto: UpdateMachineDto): Promise<Machine> {
        this.logger.info('MachineRepository#update.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('Machine not found');

        Object.assign(entity, dto);
        entity.updatedAt = new Date();
        entity.version += 1;

        return this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('MachineRepository#delete.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('Machine not found');
        await this.repository.remove(entity);
    }
}
