import { CreateTransferStatusDto } from './dto/create-transfer-status.dto';
import { UpdateTransferStatusDto } from './dto/update-transfer-status.dto';
import { FindManyOptions } from 'typeorm';
import { TransferStatus } from './entities/transfer-status.entity';

// Commands
export class CreateTransferStatusCommand {
    constructor(public readonly dto: CreateTransferStatusDto) { }
}

export class UpdateTransferStatusCommand {
    constructor(public readonly id: string, public readonly dto: UpdateTransferStatusDto) { }
}

export class DeleteTransferStatusCommand {
    constructor(public readonly id: string) { }
}

// Queries
export class GetTransferStatusesQuery {
    constructor(public readonly options?: FindManyOptions<TransferStatus>) { }
}

export class GetTransferStatusByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetTransferStatusByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountTransferStatusesQuery {
    constructor(public readonly options?: FindManyOptions<TransferStatus>) { }
}
