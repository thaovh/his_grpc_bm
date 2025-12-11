import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TransferStatusRepository } from '../repositories/transfer-status.repository';
import {
    CreateTransferStatusCommand,
    UpdateTransferStatusCommand,
    DeleteTransferStatusCommand,
    GetTransferStatusesQuery,
    GetTransferStatusByIdQuery,
    GetTransferStatusByCodeQuery,
    CountTransferStatusesQuery,
} from '../transfer-status.cqrs';

@CommandHandler(CreateTransferStatusCommand)
export class CreateTransferStatusHandler implements ICommandHandler<CreateTransferStatusCommand> {
    constructor(private readonly repository: TransferStatusRepository) { }
    async execute(command: CreateTransferStatusCommand) {
        return this.repository.create(command.dto);
    }
}

@CommandHandler(UpdateTransferStatusCommand)
export class UpdateTransferStatusHandler implements ICommandHandler<UpdateTransferStatusCommand> {
    constructor(private readonly repository: TransferStatusRepository) { }
    async execute(command: UpdateTransferStatusCommand) {
        return this.repository.update(command.id, command.dto);
    }
}

@CommandHandler(DeleteTransferStatusCommand)
export class DeleteTransferStatusHandler implements ICommandHandler<DeleteTransferStatusCommand> {
    constructor(private readonly repository: TransferStatusRepository) { }
    async execute(command: DeleteTransferStatusCommand) {
        return this.repository.delete(command.id);
    }
}

@QueryHandler(GetTransferStatusesQuery)
export class GetTransferStatusesHandler implements IQueryHandler<GetTransferStatusesQuery> {
    constructor(private readonly repository: TransferStatusRepository) { }
    async execute(query: GetTransferStatusesQuery) {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetTransferStatusByIdQuery)
export class GetTransferStatusByIdHandler implements IQueryHandler<GetTransferStatusByIdQuery> {
    constructor(private readonly repository: TransferStatusRepository) { }
    async execute(query: GetTransferStatusByIdQuery) {
        return this.repository.findById(query.id);
    }
}

@QueryHandler(GetTransferStatusByCodeQuery)
export class GetTransferStatusByCodeHandler implements IQueryHandler<GetTransferStatusByCodeQuery> {
    constructor(private readonly repository: TransferStatusRepository) { }
    async execute(query: GetTransferStatusByCodeQuery) {
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountTransferStatusesQuery)
export class CountTransferStatusesHandler implements IQueryHandler<CountTransferStatusesQuery> {
    constructor(private readonly repository: TransferStatusRepository) { }
    async execute(query: CountTransferStatusesQuery) {
        return this.repository.count(query.options);
    }
}

export const TransferStatusHandlers = [
    CreateTransferStatusHandler,
    UpdateTransferStatusHandler,
    DeleteTransferStatusHandler,
    GetTransferStatusesHandler,
    GetTransferStatusByIdHandler,
    GetTransferStatusByCodeHandler,
    CountTransferStatusesHandler,
];
