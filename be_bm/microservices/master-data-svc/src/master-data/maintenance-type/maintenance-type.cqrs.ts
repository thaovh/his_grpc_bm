import { CreateMaintenanceTypeDto } from './dto/create-maintenance-type.dto';
import { UpdateMaintenanceTypeDto } from './dto/update-maintenance-type.dto';
import { FindManyOptions } from 'typeorm';
import { MaintenanceType } from './entities/maintenance-type.entity';

// Commands
export class CreateMaintenanceTypeCommand {
    constructor(public readonly dto: CreateMaintenanceTypeDto) { }
}

export class UpdateMaintenanceTypeCommand {
    constructor(public readonly id: string, public readonly dto: UpdateMaintenanceTypeDto) { }
}

export class DeleteMaintenanceTypeCommand {
    constructor(public readonly id: string) { }
}

// Queries
export class GetMaintenanceTypesQuery {
    constructor(public readonly options?: FindManyOptions<MaintenanceType>) { }
}

export class GetMaintenanceTypeByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetMaintenanceTypeByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountMaintenanceTypesQuery {
    constructor(public readonly options?: FindManyOptions<MaintenanceType>) { }
}
