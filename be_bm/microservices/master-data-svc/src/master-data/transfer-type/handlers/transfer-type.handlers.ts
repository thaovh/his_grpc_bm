import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TransferTypeRepository } from '../repositories/transfer-type.repository';
import {
    CreateTransferTypeCommand,
    UpdateTransferTypeCommand,
    DeleteTransferTypeCommand,
    GetTransferTypesQuery,
    GetTransferTypeByIdQuery,
    GetTransferTypeByCodeQuery,
    CountTransferTypesQuery
} from '../transfer-type.cqrs';

@CommandHandler(CreateTransferTypeCommand)
export class CreateTransferTypeHandler implements ICommandHandler<CreateTransferTypeCommand> {
    constructor(private readonly repository: TransferTypeRepository) { }
    async execute(command: CreateTransferTypeCommand) {
        return this.repository.create(command.data);
    }
}

@CommandHandler(UpdateTransferTypeCommand)
export class UpdateTransferTypeHandler implements ICommandHandler<UpdateTransferTypeCommand> {
    constructor(private readonly repository: TransferTypeRepository) { }
    async execute(command: UpdateTransferTypeCommand) {
        return this.repository.update(command.id, command.data);
    }
}

@CommandHandler(DeleteTransferTypeCommand)
export class DeleteTransferTypeHandler implements ICommandHandler<DeleteTransferTypeCommand> {
    constructor(private readonly repository: TransferTypeRepository) { }
    async execute(command: DeleteTransferTypeCommand) {
        return this.repository.delete(command.id);
    }
}

@QueryHandler(GetTransferTypesQuery)
export class GetTransferTypesHandler implements IQueryHandler<GetTransferTypesQuery> {
    constructor(private readonly repository: TransferTypeRepository) { }
    async execute(query: GetTransferTypesQuery) {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetTransferTypeByIdQuery)
export class GetTransferTypeByIdHandler implements IQueryHandler<GetTransferTypeByIdQuery> {
    constructor(private readonly repository: TransferTypeRepository) { }
    async execute(query: GetTransferTypeByIdQuery) {
        return this.repository.findById(query.id);
    }
}

@QueryHandler(GetTransferTypeByCodeQuery)
export class GetTransferTypeByCodeHandler implements IQueryHandler<GetTransferTypeByCodeQuery> {
    constructor(private readonly repository: TransferTypeRepository) { }
    async execute(query: GetTransferTypeByCodeQuery) {
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountTransferTypesQuery)
export class CountTransferTypesHandler implements IQueryHandler<CountTransferTypesQuery> {
    constructor(private readonly repository: TransferTypeRepository) { }
    async execute(query: CountTransferTypesQuery) {
        return this.repository.count(query.options);
    }
}

export const TransferTypeHandlers = [
    CreateTransferTypeHandler,
    UpdateTransferTypeHandler,
    DeleteTransferTypeHandler,
    GetTransferTypesHandler,
    GetTransferTypeByIdHandler,
    GetTransferTypeByCodeHandler,
    CountTransferTypesHandler
];
