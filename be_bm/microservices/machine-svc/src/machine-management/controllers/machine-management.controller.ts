// Trigger rebuild - search fix
import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { isEmpty } from 'lodash';

import { Query, Count, Id, Name } from '../../commons/interfaces/commons.interface';
import { MachineManagementService } from '../services/machine-management.service';

import { parseWhere } from '../../commons/utils/query-parser';

@Controller()
export class MachineManagementController {
    constructor(
        private readonly service: MachineManagementService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MachineManagementController.name);
    }

    // Machine methods
    @GrpcMethod('MachineService', 'findAllMachines')
    async findAllMachines(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        const options = { where: parseWhere(where) };
        if (query.limit) options['take'] = query.limit;
        if (query.offset) options['skip'] = query.offset;

        this.logger.info('MachineManagementController#findAllMachines.call', { options });
        const result = await this.service.findAllMachines(options);
        return { data: result };
    }

    @GrpcMethod('MachineService', 'findMachineById')
    async findMachineById(data: { id: string }) {
        return this.service.findMachineById(data.id);
    }

    @GrpcMethod('MachineService', 'findMachineByCode')
    async findMachineByCode(data: Name) {
        return this.service.findMachineByCode(data.name);
    }

    @GrpcMethod('MachineService', 'countMachines')
    async countMachines(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        const options = { where: parseWhere(where) };
        const count = await this.service.countMachines(options);
        return { count };
    }

    @GrpcMethod('MachineService', 'createMachine')
    async createMachine(data: any) {
        return this.service.createMachine(data);
    }

    @GrpcMethod('MachineService', 'updateMachine')
    async updateMachine(data: any) {
        const { id, ...dto } = data;
        return this.service.updateMachine(id, dto);
    }

    @GrpcMethod('MachineService', 'destroyMachine')
    async destroyMachine(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        if (where.id) {
            await this.service.deleteMachine(where.id);
        }
        return { count: 1 };
    }

    // Maintenance methods
    @GrpcMethod('MachineService', 'findAllMaintenanceRecords')
    async findAllMaintenanceRecords(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        const options = { where: parseWhere(where) };
        if (query.limit) options['take'] = query.limit;
        if (query.offset) options['skip'] = query.offset;
        const result = await this.service.findAllMaintenanceRecords(options);
        return { data: result };
    }

    @GrpcMethod('MachineService', 'findMaintenanceRecordById')
    async findMaintenanceRecordById(data: Id) {
        return this.service.findMaintenanceRecordById(data.id);
    }

    @GrpcMethod('MachineService', 'countMaintenanceRecords')
    async countMaintenanceRecords(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        const options = { where: parseWhere(where) };
        const count = await this.service.countMaintenanceRecords(options);
        return { count };
    }

    @GrpcMethod('MachineService', 'createMaintenanceRecord')
    async createMaintenanceRecord(data: any) {
        return this.service.createMaintenanceRecord(data);
    }

    @GrpcMethod('MachineService', 'updateMaintenanceRecord')
    async updateMaintenanceRecord(data: any) {
        const { id, ...dto } = data;
        return this.service.updateMaintenanceRecord(id, dto);
    }

    @GrpcMethod('MachineService', 'destroyMaintenanceRecord')
    async destroyMaintenanceRecord(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        if (where.id) {
            await this.service.deleteMaintenanceRecord(where.id);
        }
        return { count: 1 };
    }

    // Document methods
    @GrpcMethod('MachineService', 'findAllMachineDocuments')
    async findAllMachineDocuments(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        const options = { where: parseWhere(where) };
        if (query.limit) options['take'] = query.limit;
        if (query.offset) options['skip'] = query.offset;
        const result = await this.service.findAllMachineDocuments(options);
        return { data: result };
    }

    @GrpcMethod('MachineService', 'findMachineDocumentById')
    async findMachineDocumentById(data: Id) {
        return this.service.findMachineDocumentById(data.id);
    }

    @GrpcMethod('MachineService', 'countMachineDocuments')
    async countMachineDocuments(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        const options = { where: parseWhere(where) };
        const count = await this.service.countMachineDocuments(options);
        return { count };
    }

    @GrpcMethod('MachineService', 'createMachineDocument')
    async createMachineDocument(data: any) {
        return this.service.createMachineDocument(data);
    }

    @GrpcMethod('MachineService', 'updateMachineDocument')
    async updateMachineDocument(data: any) {
        const { id, ...dto } = data;
        return this.service.updateMachineDocument(id, dto);
    }

    @GrpcMethod('MachineService', 'destroyMachineDocument')
    async destroyMachineDocument(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        if (where.id) {
            await this.service.deleteMachineDocument(where.id);
        }
        return { count: 1 };
    }

    // Transfer methods
    @GrpcMethod('MachineService', 'findAllTransfers')
    async findAllTransfers(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        const options = { where: parseWhere(where) };
        if (query.limit) options['take'] = query.limit;
        if (query.offset) options['skip'] = query.offset;
        const result = await this.service.findAllTransfers(options);
        return { data: result };
    }

    @GrpcMethod('MachineService', 'findTransferById')
    async findTransferById(data: Id) {
        return this.service.findTransferById(data.id);
    }

    @GrpcMethod('MachineService', 'countTransfers')
    async countTransfers(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        const options = { where: parseWhere(where) };
        const count = await this.service.countTransfers(options);
        return { count };
    }

    @GrpcMethod('MachineService', 'createTransfer')
    async createTransfer(data: any) {
        return this.service.createTransfer(data);
    }

    @GrpcMethod('MachineService', 'updateTransfer')
    async updateTransfer(data: any) {
        const { id, ...dto } = data;
        return this.service.updateTransfer(id, dto);
    }

    @GrpcMethod('MachineService', 'destroyTransfer')
    async destroyTransfer(query: Query) {
        const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
        if (where.id) {
            await this.service.deleteTransfer(where.id);
        }
        return { count: 1 };
    }
}
