import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { FindManyOptions } from 'typeorm';
import { Department } from './entities/department.entity';

// Commands
export class CreateDepartmentCommand {
    constructor(public readonly departmentDto: CreateDepartmentDto) { }
}

export class UpdateDepartmentCommand {
    constructor(public readonly id: string, public readonly departmentDto: UpdateDepartmentDto) { }
}

// Queries
export class GetDepartmentsQuery {
    constructor(public readonly options?: FindManyOptions<Department>) { }
}

export class GetDepartmentByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetDepartmentByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountDepartmentsQuery {
    constructor(public readonly options?: FindManyOptions<Department>) { }
}
