export class CreateMachineDto {
    code: string;
    name: string;
    categoryId?: string;
    statusId?: string;
    unitId?: string;
    vendorId?: string;
    manufacturerCountryId?: string;
    fundingSourceId?: string;
    serialNumber?: string;
    model?: string;
    manufacturingYear?: number;
    purchaseDate?: Date;
    warrantyExpirationDate?: Date;
    description?: string;
    managementDepartmentId?: string;
    createdBy?: string;
}
