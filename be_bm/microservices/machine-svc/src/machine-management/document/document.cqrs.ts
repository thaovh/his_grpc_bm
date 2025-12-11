import { CreateMachineDocumentDto } from './dto/create-machine-document.dto';
import { UpdateMachineDocumentDto } from './dto/update-machine-document.dto';

// Commands
export class CreateMachineDocumentCommand {
    constructor(public readonly dto: CreateMachineDocumentDto) { }
}

export class UpdateMachineDocumentCommand {
    constructor(public readonly id: string, public readonly dto: UpdateMachineDocumentDto) { }
}

export class DeleteMachineDocumentCommand {
    constructor(public readonly id: string) { }
}

// Queries
export class GetMachineDocumentByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetAllMachineDocumentsQuery {
    constructor(public readonly options?: any) { }
}

export class CountMachineDocumentsQuery {
    constructor(public readonly options?: any) { }
}
