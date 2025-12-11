// Commands
export class CreateTransferCommand {
    constructor(public readonly data: any) { }
}

export class UpdateTransferCommand {
    constructor(public readonly id: string, public readonly data: any) { }
}

export class DeleteTransferCommand {
    constructor(public readonly id: string) { }
}

// Queries
export class GetTransferByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetAllTransfersQuery {
    constructor(public readonly options?: any) { }
}

export class CountTransfersQuery {
    constructor(public readonly options?: any) { }
}
