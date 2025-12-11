import { CreateMachineStatusDto } from './dto/create-machine-status.dto';
import { UpdateMachineStatusDto } from './dto/update-machine-status.dto';
import { FindManyOptions } from 'typeorm';
import { MachineStatus } from './entities/machine-status.entity';

// Commands
export class CreateMachineStatusCommand {
    constructor(public readonly dto: CreateMachineStatusDto) { }
}

export class UpdateMachineStatusCommand {
    constructor(public readonly id: string, public readonly dto: UpdateMachineStatusDto) { }
}

export class DeleteMachineStatusCommand {
    constructor(public readonly id: string) { }
}

// Queries
export class GetMachineStatusesQuery {
    constructor(public readonly options?: FindManyOptions<MachineStatus>) { }
}

export class GetMachineStatusByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetMachineStatusByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountMachineStatusesQuery {
    constructor(public readonly options?: FindManyOptions<MachineStatus>) { }
}
