import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Department } from '../entities/department.entity';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';

@Injectable()
export class DepartmentRepository {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(DepartmentRepository.name);
    }

    async create(departmentDto: CreateDepartmentDto): Promise<Department> {
        this.logger.info('DepartmentRepository#create.call', { code: departmentDto.code, createdBy: departmentDto.createdBy });

        const { randomUUID } = require('crypto');
        const id = randomUUID();
        const now = new Date();

        const departmentData: any = {
            id,
            code: departmentDto.code,
            name: departmentDto.name,
            parentId: departmentDto.parentId ?? null,
            branchId: departmentDto.branchId,

            departmentTypeId: departmentDto.departmentTypeId,
            hisId: departmentDto.hisId ?? null,
            isAssetManagement: departmentDto.isAssetManagement ?? 0,
            isActive: 1,
            version: 1,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            createdBy: departmentDto.createdBy ?? null,
            updatedBy: departmentDto.createdBy ?? null,
        };

        const department = this.departmentRepository.create(departmentData);
        await this.departmentRepository.save(department);

        const savedDepartment = await this.departmentRepository.findOne({ where: { id } });
        if (!savedDepartment) throw new Error('Failed to fetch created Department');

        this.logger.info('DepartmentRepository#create.result', { id: savedDepartment.id, code: savedDepartment.code });
        return savedDepartment;
    }

    async update(id: string, departmentDto: UpdateDepartmentDto): Promise<Department> {
        this.logger.info('DepartmentRepository#update.call', { id, updatedBy: departmentDto.updatedBy });

        const department = await this.departmentRepository.findOne({ where: { id } });
        if (!department) throw new Error(`Department with id ${id} not found`);

        if (departmentDto.code !== undefined) department.code = departmentDto.code;
        if (departmentDto.name !== undefined) department.name = departmentDto.name;
        if (departmentDto.parentId !== undefined) department.parentId = departmentDto.parentId ?? null;
        if (departmentDto.branchId !== undefined) department.branchId = departmentDto.branchId;
        if (departmentDto.departmentTypeId !== undefined) department.departmentTypeId = departmentDto.departmentTypeId;
        if (departmentDto.hisId !== undefined) department.hisId = departmentDto.hisId;
        if (departmentDto.isAssetManagement !== undefined) department.isAssetManagement = departmentDto.isAssetManagement;
        if (departmentDto.updatedBy !== undefined && departmentDto.updatedBy !== null) {
            department.updatedBy = departmentDto.updatedBy;
        }

        department.updatedAt = new Date();
        department.version += 1;

        await this.departmentRepository.save(department);

        const updatedDepartment = await this.departmentRepository.findOne({ where: { id } });
        if (!updatedDepartment) throw new Error('Failed to fetch updated Department');

        this.logger.info('DepartmentRepository#update.result', { id: updatedDepartment.id });
        return updatedDepartment;
    }

    async findAll(options?: FindManyOptions<Department>): Promise<Department[]> {
        return this.departmentRepository.find({
            ...options,
            order: options?.order || { name: 'ASC' },
            relations: options?.relations || ['branch', 'departmentType', 'parent', 'children'],
        });
    }

    async findOne(id: string): Promise<Department | null> {
        return this.departmentRepository.findOne({
            where: { id },
            relations: ['branch', 'departmentType', 'parent', 'children']
        });
    }

    async findByCode(code: string): Promise<Department | null> {
        return this.departmentRepository.findOne({
            where: { code },
            relations: ['branch', 'departmentType', 'parent', 'children']
        });
    }

    async count(options?: FindManyOptions<Department>): Promise<number> {
        return this.departmentRepository.count(options);
    }

    async delete(id: string): Promise<void> {
        await this.departmentRepository.delete(id);
    }
}
