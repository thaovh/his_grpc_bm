import { CreateMachineDocumentTypeDto } from './dto/create-machine-document-type.dto';
import { UpdateMachineDocumentTypeDto } from './dto/update-machine-document-type.dto';
import { FindManyOptions } from 'typeorm';
import { MachineDocumentType } from './entities/machine-document-type.entity';

// Commands
export class CreateMachineDocumentTypeCommand {
    constructor(public readonly dto: CreateMachineDocumentTypeDto) { }
}

export class UpdateMachineDocumentTypeCommand {
    constructor(public readonly id: string, public readonly dto: UpdateMachineDocumentTypeDto) { }
}

// Queries
export class GetMachineDocumentTypesQuery {
    constructor(public readonly options?: FindManyOptions<MachineDocumentType>) { }
}

export class GetMachineDocumentTypeByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetMachineDocumentTypeByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountMachineDocumentTypesQuery {
    constructor(public readonly options?: FindManyOptions<MachineDocumentType>) { }
}
