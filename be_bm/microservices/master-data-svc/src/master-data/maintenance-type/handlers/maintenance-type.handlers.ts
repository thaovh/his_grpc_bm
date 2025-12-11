import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { MaintenanceTypeRepository } from '../repositories/maintenance-type.repository';
import {
    CreateMaintenanceTypeCommand,
    UpdateMaintenanceTypeCommand,
    DeleteMaintenanceTypeCommand,
    GetMaintenanceTypesQuery,
    GetMaintenanceTypeByIdQuery,
    GetMaintenanceTypeByCodeQuery,
    CountMaintenanceTypesQuery,
} from '../maintenance-type.cqrs';

@CommandHandler(CreateMaintenanceTypeCommand)
export class CreateMaintenanceTypeHandler implements ICommandHandler<CreateMaintenanceTypeCommand> {
    constructor(private readonly repository: MaintenanceTypeRepository) { }
    async execute(command: CreateMaintenanceTypeCommand) {
        return this.repository.create(command.dto);
    }
}

@CommandHandler(UpdateMaintenanceTypeCommand)
export class UpdateMaintenanceTypeHandler implements ICommandHandler<UpdateMaintenanceTypeCommand> {
    constructor(private readonly repository: MaintenanceTypeRepository) { }
    async execute(command: UpdateMaintenanceTypeCommand) {
        return this.repository.update(command.id, command.dto);
    }
}

@CommandHandler(DeleteMaintenanceTypeCommand)
export class DeleteMaintenanceTypeHandler implements ICommandHandler<DeleteMaintenanceTypeCommand> {
    constructor(private readonly repository: MaintenanceTypeRepository) { }
    async execute(command: DeleteMaintenanceTypeCommand) {
        return this.repository.delete(command.id);
    }
}

@QueryHandler(GetMaintenanceTypesQuery)
export class GetMaintenanceTypesHandler implements IQueryHandler<GetMaintenanceTypesQuery> {
    constructor(private readonly repository: MaintenanceTypeRepository) { }
    async execute(query: GetMaintenanceTypesQuery) {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetMaintenanceTypeByIdQuery)
export class GetMaintenanceTypeByIdHandler implements IQueryHandler<GetMaintenanceTypeByIdQuery> {
    constructor(private readonly repository: MaintenanceTypeRepository) { }
    async execute(query: GetMaintenanceTypeByIdQuery) {
        return this.repository.findById(query.id);
    }
}

@QueryHandler(GetMaintenanceTypeByCodeQuery)
export class GetMaintenanceTypeByCodeHandler implements IQueryHandler<GetMaintenanceTypeByCodeQuery> {
    constructor(private readonly repository: MaintenanceTypeRepository) { }
    async execute(query: GetMaintenanceTypeByCodeQuery) {
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountMaintenanceTypesQuery)
export class CountMaintenanceTypesHandler implements IQueryHandler<CountMaintenanceTypesQuery> {
    constructor(private readonly repository: MaintenanceTypeRepository) { }
    async execute(query: CountMaintenanceTypesQuery) {
        return this.repository.count(query.options);
    }
}

export const MaintenanceTypeHandlers = [
    CreateMaintenanceTypeHandler,
    UpdateMaintenanceTypeHandler,
    DeleteMaintenanceTypeHandler,
    GetMaintenanceTypesHandler,
    GetMaintenanceTypeByIdHandler,
    GetMaintenanceTypeByCodeHandler,
    CountMaintenanceTypesHandler,
];
