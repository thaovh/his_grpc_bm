import { ICommand, IQuery } from '@nestjs/cqrs';

// Commands
export class CreateTransferTypeCommand implements ICommand {
    constructor(public readonly data: any) { }
}

export class UpdateTransferTypeCommand implements ICommand {
    constructor(public readonly id: string, public readonly data: any) { }
}

export class DeleteTransferTypeCommand implements ICommand {
    constructor(public readonly id: string) { }
}

// Queries
export class GetTransferTypesQuery implements IQuery {
    constructor(public readonly options?: any) { }
}

export class GetTransferTypeByIdQuery implements IQuery {
    constructor(public readonly id: string) { }
}

export class GetTransferTypeByCodeQuery implements IQuery {
    constructor(public readonly code: string) { }
}

export class CountTransferTypesQuery implements IQuery {
    constructor(public readonly options?: any) { }
}
