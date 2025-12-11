import { join } from 'path';
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class MachineService implements OnModuleInit {
    private machineService: any;

    constructor(
        @Inject('MACHINE_PACKAGE') private readonly client: ClientGrpc,
    ) { }

    onModuleInit() {
        this.machineService = this.client.getService<any>('MachineService');
    }

    // Machine
    findAllMachines(query: any): Observable<any> { return this.machineService.findAllMachines(query); }
    findMachineById(id: string): Observable<any> { return this.machineService.findMachineById({ id }); }
    findMachineByCode(name: string): Observable<any> { return this.machineService.findMachineByCode({ name }); }
    countMachines(query: any): Observable<any> { return this.machineService.countMachines(query); }
    createMachine(data: any): Observable<any> { return this.machineService.createMachine(data); }
    updateMachine(data: any): Observable<any> { return this.machineService.updateMachine(data); }
    destroyMachine(query: any): Observable<any> { return this.machineService.destroyMachine(query); }

    // Maintenance
    findAllMaintenanceRecords(query: any): Observable<any> { return this.machineService.findAllMaintenanceRecords(query); }
    findMaintenanceRecordById(id: string): Observable<any> { return this.machineService.findMaintenanceRecordById({ id }); }
    countMaintenanceRecords(query: any): Observable<any> { return this.machineService.countMaintenanceRecords(query); }
    createMaintenanceRecord(data: any): Observable<any> { return this.machineService.createMaintenanceRecord(data); }
    updateMaintenanceRecord(data: any): Observable<any> { return this.machineService.updateMaintenanceRecord(data); }
    destroyMaintenanceRecord(query: any): Observable<any> { return this.machineService.destroyMaintenanceRecord(query); }

    // Documents
    findAllMachineDocuments(query: any): Observable<any> { return this.machineService.findAllMachineDocuments(query); }
    findMachineDocumentById(id: string): Observable<any> { return this.machineService.findMachineDocumentById({ id }); }
    countMachineDocuments(query: any): Observable<any> { return this.machineService.countMachineDocuments(query); }
    createMachineDocument(data: any): Observable<any> { return this.machineService.createMachineDocument(data); }
    updateMachineDocument(data: any): Observable<any> { return this.machineService.updateMachineDocument(data); }
    destroyMachineDocument(query: any): Observable<any> { return this.machineService.destroyMachineDocument(query); }

    // Transfers
    findAllTransfers(query: any): Observable<any> { return this.machineService.findAllTransfers(query); }
    findTransferById(id: string): Observable<any> { return this.machineService.findTransferById({ id }); }
    countTransfers(query: any): Observable<any> { return this.machineService.countTransfers(query); }
    createTransfer(data: any): Observable<any> { return this.machineService.createTransfer(data); }
    updateTransfer(data: any): Observable<any> { return this.machineService.updateTransfer(data); }
    destroyTransfer(query: any): Observable<any> { return this.machineService.destroyTransfer(query); }
}
