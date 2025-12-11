import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { MachineDocumentRepository } from '../repositories/machine-document.repository';
import {
    CreateMachineDocumentCommand,
    UpdateMachineDocumentCommand,
    DeleteMachineDocumentCommand,
    GetAllMachineDocumentsQuery,
    GetMachineDocumentByIdQuery,
    CountMachineDocumentsQuery,
} from '../document.cqrs';
import { MachineDocument } from '../entities/machine-document.entity';

@CommandHandler(CreateMachineDocumentCommand)
export class CreateMachineDocumentHandler implements ICommandHandler<CreateMachineDocumentCommand> {
    constructor(private readonly repository: MachineDocumentRepository) { }
    async execute(command: CreateMachineDocumentCommand): Promise<MachineDocument> {
        return this.repository.create(command.dto);
    }
}

@CommandHandler(UpdateMachineDocumentCommand)
export class UpdateMachineDocumentHandler implements ICommandHandler<UpdateMachineDocumentCommand> {
    constructor(private readonly repository: MachineDocumentRepository) { }
    async execute(command: UpdateMachineDocumentCommand): Promise<MachineDocument> {
        return this.repository.update(command.id, command.dto);
    }
}

@CommandHandler(DeleteMachineDocumentCommand)
export class DeleteMachineDocumentHandler implements ICommandHandler<DeleteMachineDocumentCommand> {
    constructor(private readonly repository: MachineDocumentRepository) { }
    async execute(command: DeleteMachineDocumentCommand): Promise<void> {
        return this.repository.delete(command.id);
    }
}

@QueryHandler(GetAllMachineDocumentsQuery)
export class GetAllMachineDocumentsHandler implements IQueryHandler<GetAllMachineDocumentsQuery> {
    constructor(private readonly repository: MachineDocumentRepository) { }
    async execute(query: GetAllMachineDocumentsQuery): Promise<MachineDocument[]> {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetMachineDocumentByIdQuery)
export class GetMachineDocumentByIdHandler implements IQueryHandler<GetMachineDocumentByIdQuery> {
    constructor(private readonly repository: MachineDocumentRepository) { }
    async execute(query: GetMachineDocumentByIdQuery): Promise<MachineDocument | null> {
        return this.repository.findById(query.id);
    }
}

@QueryHandler(CountMachineDocumentsQuery)
export class CountMachineDocumentsHandler implements IQueryHandler<CountMachineDocumentsQuery> {
    constructor(private readonly repository: MachineDocumentRepository) { }
    async execute(query: CountMachineDocumentsQuery): Promise<number> {
        return this.repository.count(query.options);
    }
}

export const MachineDocumentHandlers = [
    CreateMachineDocumentHandler,
    UpdateMachineDocumentHandler,
    DeleteMachineDocumentHandler,
    GetAllMachineDocumentsHandler,
    GetMachineDocumentByIdHandler,
    CountMachineDocumentsHandler,
];
