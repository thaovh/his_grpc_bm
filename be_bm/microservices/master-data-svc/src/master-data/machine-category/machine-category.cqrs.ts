import { CreateMachineCategoryDto } from './dto/create-machine-category.dto';
import { UpdateMachineCategoryDto } from './dto/update-machine-category.dto';
import { FindManyOptions } from 'typeorm';
import { MachineCategory } from './entities/machine-category.entity';

// Commands
export class CreateMachineCategoryCommand {
    constructor(public readonly dto: CreateMachineCategoryDto) { }
}

export class UpdateMachineCategoryCommand {
    constructor(public readonly id: string, public readonly dto: UpdateMachineCategoryDto) { }
}

export class DeleteMachineCategoryCommand {
    constructor(public readonly id: string) { }
}

// Queries
export class GetMachineCategoriesQuery {
    constructor(public readonly options?: FindManyOptions<MachineCategory>) { }
}

export class GetMachineCategoryByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetMachineCategoryByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountMachineCategoriesQuery {
    constructor(public readonly options?: FindManyOptions<MachineCategory>) { }
}
