import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { MaintenanceRepository } from '../repositories/maintenance.repository';
import {
    CreateMaintenanceRecordCommand,
    UpdateMaintenanceRecordCommand,
    DeleteMaintenanceRecordCommand,
    GetAllMaintenanceRecordsQuery,
    GetMaintenanceRecordByIdQuery,
    CountMaintenanceRecordsQuery,
} from '../maintenance.cqrs';
import { MaintenanceRecord } from '../entities/maintenance-record.entity';

@CommandHandler(CreateMaintenanceRecordCommand)
export class CreateMaintenanceRecordHandler implements ICommandHandler<CreateMaintenanceRecordCommand> {
    constructor(private readonly repository: MaintenanceRepository) { }
    async execute(command: CreateMaintenanceRecordCommand): Promise<MaintenanceRecord> {
        return this.repository.create(command.dto);
    }
}

@CommandHandler(UpdateMaintenanceRecordCommand)
export class UpdateMaintenanceRecordHandler implements ICommandHandler<UpdateMaintenanceRecordCommand> {
    constructor(private readonly repository: MaintenanceRepository) { }
    async execute(command: UpdateMaintenanceRecordCommand): Promise<MaintenanceRecord> {
        return this.repository.update(command.id, command.dto);
    }
}

@CommandHandler(DeleteMaintenanceRecordCommand)
export class DeleteMaintenanceRecordHandler implements ICommandHandler<DeleteMaintenanceRecordCommand> {
    constructor(private readonly repository: MaintenanceRepository) { }
    async execute(command: DeleteMaintenanceRecordCommand): Promise<void> {
        return this.repository.delete(command.id);
    }
}

@QueryHandler(GetAllMaintenanceRecordsQuery)
export class GetAllMaintenanceRecordsHandler implements IQueryHandler<GetAllMaintenanceRecordsQuery> {
    constructor(private readonly repository: MaintenanceRepository) { }
    async execute(query: GetAllMaintenanceRecordsQuery): Promise<MaintenanceRecord[]> {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetMaintenanceRecordByIdQuery)
export class GetMaintenanceRecordByIdHandler implements IQueryHandler<GetMaintenanceRecordByIdQuery> {
    constructor(private readonly repository: MaintenanceRepository) { }
    async execute(query: GetMaintenanceRecordByIdQuery): Promise<MaintenanceRecord | null> {
        return this.repository.findById(query.id);
    }
}

@QueryHandler(CountMaintenanceRecordsQuery)
export class CountMaintenanceRecordsHandler implements IQueryHandler<CountMaintenanceRecordsQuery> {
    constructor(private readonly repository: MaintenanceRepository) { }
    async execute(query: CountMaintenanceRecordsQuery): Promise<number> {
        return this.repository.count(query.options);
    }
}

export const MaintenanceHandlers = [
    CreateMaintenanceRecordHandler,
    UpdateMaintenanceRecordHandler,
    DeleteMaintenanceRecordHandler,
    GetAllMaintenanceRecordsHandler,
    GetMaintenanceRecordByIdHandler,
    CountMaintenanceRecordsHandler,
];
