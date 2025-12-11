import { CreateMachineUnitDto } from './dto/create-machine-unit.dto';
import { UpdateMachineUnitDto } from './dto/update-machine-unit.dto';
import { FindManyOptions } from 'typeorm';
import { MachineUnit } from './entities/machine-unit.entity';

// Commands
export class CreateMachineUnitCommand {
    constructor(public readonly dto: CreateMachineUnitDto) { }
}

export class UpdateMachineUnitCommand {
    constructor(public readonly id: string, public readonly dto: UpdateMachineUnitDto) { }
}

export class DeleteMachineUnitCommand {
    constructor(public readonly id: string) { }
}

// Queries
export class GetMachineUnitsQuery {
    constructor(public readonly options?: FindManyOptions<MachineUnit>) { }
}

export class GetMachineUnitByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetMachineUnitByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountMachineUnitsQuery {
    constructor(public readonly options?: FindManyOptions<MachineUnit>) { }
}
