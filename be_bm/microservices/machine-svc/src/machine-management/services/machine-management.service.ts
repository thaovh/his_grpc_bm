import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateMachineDto } from '../machine/dto/create-machine.dto';
import { UpdateMachineDto } from '../machine/dto/update-machine.dto';
import {
    CreateMachineCommand,
    UpdateMachineCommand,
    DeleteMachineCommand,
    GetAllMachinesQuery,
    GetMachineByIdQuery,
    GetMachineByCodeQuery,
    CountMachinesQuery,
} from '../machine/machine.cqrs';
import {
    CreateMaintenanceRecordCommand,
    UpdateMaintenanceRecordCommand,
    DeleteMaintenanceRecordCommand,
    GetAllMaintenanceRecordsQuery,
    GetMaintenanceRecordByIdQuery,
    CountMaintenanceRecordsQuery,
} from '../maintenance/maintenance.cqrs';
import { CreateMaintenanceRecordDto } from '../maintenance/dto/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from '../maintenance/dto/update-maintenance-record.dto';
import {
    CreateMachineDocumentCommand,
    UpdateMachineDocumentCommand,
    DeleteMachineDocumentCommand,
    GetAllMachineDocumentsQuery,
    GetMachineDocumentByIdQuery,
    CountMachineDocumentsQuery,
} from '../document/document.cqrs';
import { CreateMachineDocumentDto } from '../document/dto/create-machine-document.dto';
import { UpdateMachineDocumentDto } from '../document/dto/update-machine-document.dto';
import {
    CreateTransferCommand,
    UpdateTransferCommand,
    DeleteTransferCommand,
    GetAllTransfersQuery,
    GetTransferByIdQuery,
    CountTransfersQuery,
} from '../transfer/transfer.cqrs';

@Injectable()
export class MachineManagementService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    // Machine methods
    async findAllMachines(options?: any) { return this.queryBus.execute(new GetAllMachinesQuery(options)); }
    async findMachineById(id: string) { return this.queryBus.execute(new GetMachineByIdQuery(id)); }
    async findMachineByCode(code: string) { return this.queryBus.execute(new GetMachineByCodeQuery(code)); }
    async countMachines(options?: any) { return this.queryBus.execute(new CountMachinesQuery(options)); }
    async createMachine(dto: CreateMachineDto) { return this.commandBus.execute(new CreateMachineCommand(dto)); }
    async updateMachine(id: string, dto: UpdateMachineDto) { return this.commandBus.execute(new UpdateMachineCommand(id, dto)); }
    async deleteMachine(id: string) { return this.commandBus.execute(new DeleteMachineCommand(id)); }

    // Maintenance methods
    async findAllMaintenanceRecords(options?: any) { return this.queryBus.execute(new GetAllMaintenanceRecordsQuery(options)); }
    async findMaintenanceRecordById(id: string) { return this.queryBus.execute(new GetMaintenanceRecordByIdQuery(id)); }
    async countMaintenanceRecords(options?: any) { return this.queryBus.execute(new CountMaintenanceRecordsQuery(options)); }
    async createMaintenanceRecord(dto: CreateMaintenanceRecordDto) { return this.commandBus.execute(new CreateMaintenanceRecordCommand(dto)); }
    async updateMaintenanceRecord(id: string, dto: UpdateMaintenanceRecordDto) { return this.commandBus.execute(new UpdateMaintenanceRecordCommand(id, dto)); }
    async deleteMaintenanceRecord(id: string) { return this.commandBus.execute(new DeleteMaintenanceRecordCommand(id)); }

    // Document methods
    async findAllMachineDocuments(options?: any) { return this.queryBus.execute(new GetAllMachineDocumentsQuery(options)); }
    async findMachineDocumentById(id: string) { return this.queryBus.execute(new GetMachineDocumentByIdQuery(id)); }
    async countMachineDocuments(options?: any) { return this.queryBus.execute(new CountMachineDocumentsQuery(options)); }
    async createMachineDocument(dto: CreateMachineDocumentDto) { return this.commandBus.execute(new CreateMachineDocumentCommand(dto)); }
    async updateMachineDocument(id: string, dto: UpdateMachineDocumentDto) { return this.commandBus.execute(new UpdateMachineDocumentCommand(id, dto)); }
    async deleteMachineDocument(id: string) { return this.commandBus.execute(new DeleteMachineDocumentCommand(id)); }

    // Transfer methods
    async findAllTransfers(options?: any) { return this.queryBus.execute(new GetAllTransfersQuery(options)); }
    async findTransferById(id: string) { return this.queryBus.execute(new GetTransferByIdQuery(id)); }
    async countTransfers(options?: any) { return this.queryBus.execute(new CountTransfersQuery(options)); }
    async createTransfer(data: any) { return this.commandBus.execute(new CreateTransferCommand(data)); }
    async updateTransfer(id: string, data: any) { return this.commandBus.execute(new UpdateTransferCommand(id, data)); }
    async deleteTransfer(id: string) { return this.commandBus.execute(new DeleteTransferCommand(id)); }
}
