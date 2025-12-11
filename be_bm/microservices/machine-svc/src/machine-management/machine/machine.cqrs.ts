import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

// Commands
export class CreateMachineCommand {
    constructor(public readonly dto: CreateMachineDto) { }
}

export class UpdateMachineCommand {
    constructor(public readonly id: string, public readonly dto: UpdateMachineDto) { }
}

export class DeleteMachineCommand {
    constructor(public readonly id: string) { }
}

// Queries
export class GetMachineByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetMachineByCodeQuery {
    constructor(public readonly code: string) { }
}

export class GetAllMachinesQuery {
    constructor(public readonly options?: any) { }
}

export class CountMachinesQuery {
    constructor(public readonly options?: any) { }
}
