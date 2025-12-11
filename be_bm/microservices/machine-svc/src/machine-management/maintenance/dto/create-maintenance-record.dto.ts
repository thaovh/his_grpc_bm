export class CreateMaintenanceRecordDto {
    machineId: string;
    maintenanceTypeId: string;
    date: Date;
    performer?: string;
    description?: string;
    cost?: number;
    nextMaintenanceDate?: Date;
    createdBy?: string;
}
