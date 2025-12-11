import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Department } from '../department/entities/department.entity';
import { CreateDepartmentDto } from '../department/dto/create-department.dto';
import { UpdateDepartmentDto } from '../department/dto/update-department.dto';
import {
    CreateDepartmentCommand,
    UpdateDepartmentCommand,
    GetDepartmentsQuery,
    GetDepartmentByIdQuery,
    GetDepartmentByCodeQuery,
    CountDepartmentsQuery
} from '../department/department.cqrs';
import { DepartmentRepository } from '../department/repositories/department.repository';

@Injectable()
export class DepartmentService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly repository: DepartmentRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(DepartmentService.name);
    }

    async findAll(query?: FindManyOptions<Department>): Promise<Department[]> {
        return this.queryBus.execute(new GetDepartmentsQuery(query));
    }

    async findById(id: string): Promise<Department | null> {
        return this.queryBus.execute(new GetDepartmentByIdQuery(id));
    }

    async findByCode(code: string): Promise<Department | null> {
        return this.queryBus.execute(new GetDepartmentByCodeQuery(code));
    }

    async count(query?: FindManyOptions<Department>): Promise<number> {
        return this.queryBus.execute(new CountDepartmentsQuery(query));
    }

    async create(dto: CreateDepartmentDto): Promise<Department> {
        return this.commandBus.execute(new CreateDepartmentCommand(dto));
    }

    async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
        return this.commandBus.execute(new UpdateDepartmentCommand(id, dto));
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
