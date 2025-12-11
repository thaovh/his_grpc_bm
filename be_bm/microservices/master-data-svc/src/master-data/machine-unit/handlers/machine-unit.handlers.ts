import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { MachineUnitRepository } from '../repositories/machine-unit.repository';
import {
    CreateMachineUnitCommand,
    UpdateMachineUnitCommand,
    DeleteMachineUnitCommand,
    GetMachineUnitsQuery,
    GetMachineUnitByIdQuery,
    GetMachineUnitByCodeQuery,
    CountMachineUnitsQuery,
} from '../machine-unit.cqrs';

@CommandHandler(CreateMachineUnitCommand)
export class CreateMachineUnitHandler implements ICommandHandler<CreateMachineUnitCommand> {
    constructor(private readonly repository: MachineUnitRepository) { }
    async execute(command: CreateMachineUnitCommand) {
        return this.repository.create(command.dto);
    }
}

@CommandHandler(UpdateMachineUnitCommand)
export class UpdateMachineUnitHandler implements ICommandHandler<UpdateMachineUnitCommand> {
    constructor(private readonly repository: MachineUnitRepository) { }
    async execute(command: UpdateMachineUnitCommand) {
        return this.repository.update(command.id, command.dto);
    }
}

@CommandHandler(DeleteMachineUnitCommand)
export class DeleteMachineUnitHandler implements ICommandHandler<DeleteMachineUnitCommand> {
    constructor(private readonly repository: MachineUnitRepository) { }
    async execute(command: DeleteMachineUnitCommand) {
        return this.repository.delete(command.id);
    }
}

@QueryHandler(GetMachineUnitsQuery)
export class GetMachineUnitsHandler implements IQueryHandler<GetMachineUnitsQuery> {
    constructor(private readonly repository: MachineUnitRepository) { }
    async execute(query: GetMachineUnitsQuery) {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetMachineUnitByIdQuery)
export class GetMachineUnitByIdHandler implements IQueryHandler<GetMachineUnitByIdQuery> {
    constructor(private readonly repository: MachineUnitRepository) { }
    async execute(query: GetMachineUnitByIdQuery) {
        return this.repository.findById(query.id);
    }
}

@QueryHandler(GetMachineUnitByCodeQuery)
export class GetMachineUnitByCodeHandler implements IQueryHandler<GetMachineUnitByCodeQuery> {
    constructor(private readonly repository: MachineUnitRepository) { }
    async execute(query: GetMachineUnitByCodeQuery) {
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountMachineUnitsQuery)
export class CountMachineUnitsHandler implements IQueryHandler<CountMachineUnitsQuery> {
    constructor(private readonly repository: MachineUnitRepository) { }
    async execute(query: CountMachineUnitsQuery) {
        return this.repository.count(query.options);
    }
}

export const MachineUnitHandlers = [
    CreateMachineUnitHandler,
    UpdateMachineUnitHandler,
    DeleteMachineUnitHandler,
    GetMachineUnitsHandler,
    GetMachineUnitByIdHandler,
    GetMachineUnitByCodeHandler,
    CountMachineUnitsHandler,
];
