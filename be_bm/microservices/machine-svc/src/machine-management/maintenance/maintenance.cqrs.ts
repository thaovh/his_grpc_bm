import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dto/update-maintenance-record.dto';

// Commands
export class CreateMaintenanceRecordCommand {
    constructor(public readonly dto: CreateMaintenanceRecordDto) { }
}

export class UpdateMaintenanceRecordCommand {
    constructor(public readonly id: string, public readonly dto: UpdateMaintenanceRecordDto) { }
}

export class DeleteMaintenanceRecordCommand {
    constructor(public readonly id: string) { }
}

// Queries
export class GetMaintenanceRecordByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetAllMaintenanceRecordsQuery {
    constructor(public readonly options?: any) { }
}

export class CountMaintenanceRecordsQuery {
    constructor(public readonly options?: any) { }
}
