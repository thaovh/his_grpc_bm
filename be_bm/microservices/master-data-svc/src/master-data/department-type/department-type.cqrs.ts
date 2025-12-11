import { CreateDepartmentTypeDto } from './dto/create-department-type.dto';
import { UpdateDepartmentTypeDto } from './dto/update-department-type.dto';
import { FindManyOptions } from 'typeorm';
import { DepartmentType } from './entities/department-type.entity';

// Commands
export class CreateDepartmentTypeCommand {
    constructor(public readonly departmentTypeDto: CreateDepartmentTypeDto) { }
}

export class UpdateDepartmentTypeCommand {
    constructor(public readonly id: string, public readonly departmentTypeDto: UpdateDepartmentTypeDto) { }
}

// Queries
export class GetDepartmentTypesQuery {
    constructor(public readonly options?: FindManyOptions<DepartmentType>) { }
}

export class GetDepartmentTypeByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetDepartmentTypeByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountDepartmentTypesQuery {
    constructor(public readonly options?: FindManyOptions<DepartmentType>) { }
}
