import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { DepartmentType } from '../department-type/entities/department-type.entity';
import { CreateDepartmentTypeDto } from '../department-type/dto/create-department-type.dto';
import { UpdateDepartmentTypeDto } from '../department-type/dto/update-department-type.dto';
import {
    CreateDepartmentTypeCommand,
    UpdateDepartmentTypeCommand,
    GetDepartmentTypesQuery,
    GetDepartmentTypeByIdQuery,
    GetDepartmentTypeByCodeQuery,
    CountDepartmentTypesQuery
} from '../department-type/department-type.cqrs';
import { DepartmentTypeRepository } from '../department-type/repositories/department-type.repository';

@Injectable()
export class DepartmentTypeService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly repository: DepartmentTypeRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(DepartmentTypeService.name);
    }

    async findAll(query?: FindManyOptions<DepartmentType>): Promise<DepartmentType[]> {
        return this.queryBus.execute(new GetDepartmentTypesQuery(query));
    }

    async findById(id: string): Promise<DepartmentType | null> {
        return this.queryBus.execute(new GetDepartmentTypeByIdQuery(id));
    }

    async findByCode(code: string): Promise<DepartmentType | null> {
        return this.queryBus.execute(new GetDepartmentTypeByCodeQuery(code));
    }

    async count(query?: FindManyOptions<DepartmentType>): Promise<number> {
        return this.queryBus.execute(new CountDepartmentTypesQuery(query));
    }

    async create(dto: CreateDepartmentTypeDto): Promise<DepartmentType> {
        return this.commandBus.execute(new CreateDepartmentTypeCommand(dto));
    }

    async update(id: string, dto: UpdateDepartmentTypeDto): Promise<DepartmentType> {
        return this.commandBus.execute(new UpdateDepartmentTypeCommand(id, dto));
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
