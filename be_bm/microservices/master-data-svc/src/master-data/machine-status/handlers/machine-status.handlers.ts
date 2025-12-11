import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { MachineStatusRepository } from '../repositories/machine-status.repository';
import {
    CreateMachineStatusCommand,
    UpdateMachineStatusCommand,
    DeleteMachineStatusCommand,
    GetMachineStatusesQuery,
    GetMachineStatusByIdQuery,
    GetMachineStatusByCodeQuery,
    CountMachineStatusesQuery,
} from '../machine-status.cqrs';

@CommandHandler(CreateMachineStatusCommand)
export class CreateMachineStatusHandler implements ICommandHandler<CreateMachineStatusCommand> {
    constructor(private readonly repository: MachineStatusRepository) { }
    async execute(command: CreateMachineStatusCommand) {
        return this.repository.create(command.dto);
    }
}

@CommandHandler(UpdateMachineStatusCommand)
export class UpdateMachineStatusHandler implements ICommandHandler<UpdateMachineStatusCommand> {
    constructor(private readonly repository: MachineStatusRepository) { }
    async execute(command: UpdateMachineStatusCommand) {
        return this.repository.update(command.id, command.dto);
    }
}

@CommandHandler(DeleteMachineStatusCommand)
export class DeleteMachineStatusHandler implements ICommandHandler<DeleteMachineStatusCommand> {
    constructor(private readonly repository: MachineStatusRepository) { }
    async execute(command: DeleteMachineStatusCommand) {
        return this.repository.delete(command.id);
    }
}

@QueryHandler(GetMachineStatusesQuery)
export class GetMachineStatusesHandler implements IQueryHandler<GetMachineStatusesQuery> {
    constructor(private readonly repository: MachineStatusRepository) { }
    async execute(query: GetMachineStatusesQuery) {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetMachineStatusByIdQuery)
export class GetMachineStatusByIdHandler implements IQueryHandler<GetMachineStatusByIdQuery> {
    constructor(private readonly repository: MachineStatusRepository) { }
    async execute(query: GetMachineStatusByIdQuery) {
        return this.repository.findById(query.id);
    }
}

@QueryHandler(GetMachineStatusByCodeQuery)
export class GetMachineStatusByCodeHandler implements IQueryHandler<GetMachineStatusByCodeQuery> {
    constructor(private readonly repository: MachineStatusRepository) { }
    async execute(query: GetMachineStatusByCodeQuery) {
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountMachineStatusesQuery)
export class CountMachineStatusesHandler implements IQueryHandler<CountMachineStatusesQuery> {
    constructor(private readonly repository: MachineStatusRepository) { }
    async execute(query: CountMachineStatusesQuery) {
        return this.repository.count(query.options);
    }
}

export const MachineStatusHandlers = [
    CreateMachineStatusHandler,
    UpdateMachineStatusHandler,
    DeleteMachineStatusHandler,
    GetMachineStatusesHandler,
    GetMachineStatusByIdHandler,
    GetMachineStatusByCodeHandler,
    CountMachineStatusesHandler,
];
