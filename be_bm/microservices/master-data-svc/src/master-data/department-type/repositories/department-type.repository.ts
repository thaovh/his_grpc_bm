import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { DepartmentType } from '../entities/department-type.entity';
import { CreateDepartmentTypeDto } from '../dto/create-department-type.dto';
import { UpdateDepartmentTypeDto } from '../dto/update-department-type.dto';

@Injectable()
export class DepartmentTypeRepository {
    constructor(
        @InjectRepository(DepartmentType)
        private readonly departmentTypeRepository: Repository<DepartmentType>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(DepartmentTypeRepository.name);
    }

    async create(departmentTypeDto: CreateDepartmentTypeDto): Promise<DepartmentType> {
        this.logger.info('DepartmentTypeRepository#create.call', { code: departmentTypeDto.code, createdBy: departmentTypeDto.createdBy });

        const { randomUUID } = require('crypto');
        const id = randomUUID();
        const now = new Date();

        const departmentTypeData: any = {
            id,
            code: departmentTypeDto.code,
            name: departmentTypeDto.name,
            isActive: 1,
            version: 1,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            createdBy: departmentTypeDto.createdBy ?? null,
            updatedBy: departmentTypeDto.createdBy ?? null,
        };

        const departmentType = this.departmentTypeRepository.create(departmentTypeData);
        await this.departmentTypeRepository.save(departmentType);

        const savedDepartmentType = await this.departmentTypeRepository.findOne({ where: { id } });
        if (!savedDepartmentType) throw new Error('Failed to fetch created DepartmentType');

        this.logger.info('DepartmentTypeRepository#create.result', { id: savedDepartmentType.id, code: savedDepartmentType.code });
        return savedDepartmentType;
    }

    async update(id: string, departmentTypeDto: UpdateDepartmentTypeDto): Promise<DepartmentType> {
        this.logger.info('DepartmentTypeRepository#update.call', { id, updatedBy: departmentTypeDto.updatedBy });

        const departmentType = await this.departmentTypeRepository.findOne({ where: { id } });
        if (!departmentType) throw new Error(`DepartmentType with id ${id} not found`);

        if (departmentTypeDto.code !== undefined) departmentType.code = departmentTypeDto.code;
        if (departmentTypeDto.name !== undefined) departmentType.name = departmentTypeDto.name;
        if (departmentTypeDto.updatedBy !== undefined && departmentTypeDto.updatedBy !== null) {
            departmentType.updatedBy = departmentTypeDto.updatedBy;
        }

        departmentType.updatedAt = new Date();
        departmentType.version += 1;

        await this.departmentTypeRepository.save(departmentType);

        const updatedDepartmentType = await this.departmentTypeRepository.findOne({ where: { id } });
        if (!updatedDepartmentType) throw new Error('Failed to fetch updated DepartmentType');

        this.logger.info('DepartmentTypeRepository#update.result', { id: updatedDepartmentType.id });
        return updatedDepartmentType;
    }

    async findAll(options?: FindManyOptions<DepartmentType>): Promise<DepartmentType[]> {
        return this.departmentTypeRepository.find({
            ...options,
            order: options?.order || { name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<DepartmentType | null> {
        return this.departmentTypeRepository.findOne({ where: { id } });
    }

    async findByCode(code: string): Promise<DepartmentType | null> {
        return this.departmentTypeRepository.findOne({ where: { code } });
    }

    async count(options?: FindManyOptions<DepartmentType>): Promise<number> {
        return this.departmentTypeRepository.count(options);
    }

    async delete(id: string): Promise<void> {
        await this.departmentTypeRepository.delete(id);
    }
}
