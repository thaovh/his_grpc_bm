import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Machine } from './machine/entities/machine.entity';
import { MaintenanceRecord } from './maintenance/entities/maintenance-record.entity';
import { MachineDocument } from './document/entities/machine-document.entity';
import { MachineTransfer } from './transfer/entities/transfer.entity';

import { MachineRepository } from './machine/repositories/machine.repository';
import { MaintenanceRepository } from './maintenance/repositories/maintenance.repository';
import { MachineDocumentRepository } from './document/repositories/machine-document.repository';
import { MachineTransferRepository } from './transfer/repositories/transfer.repository';

import { MachineHandlers } from './machine/handlers/machine.handlers';
import { MaintenanceHandlers } from './maintenance/handlers/maintenance.handlers';
import { MachineDocumentHandlers } from './document/handlers/machine-document.handlers';
import { MachineTransferHandlers } from './transfer/handlers/transfer.handlers';

import { MachineManagementService } from './services/machine-management.service';
import { MachineManagementController } from './controllers/machine-management.controller';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Machine, MaintenanceRecord, MachineDocument, MachineTransfer]),
    ],
    providers: [
        MachineRepository,
        MaintenanceRepository,
        MachineDocumentRepository,
        MachineTransferRepository,
        ...MachineHandlers,
        ...MaintenanceHandlers,
        ...MachineDocumentHandlers,
        ...MachineTransferHandlers,
        MachineManagementService,
    ],
    controllers: [MachineManagementController],
    exports: [MachineManagementService],
})
export class MachineManagementModule { }
