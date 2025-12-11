export class CreateMachineDocumentDto {
    machineId: string;
    type: string;
    fileName: string;
    fileUrl: string;
    description?: string;
    createdBy?: string;
}
