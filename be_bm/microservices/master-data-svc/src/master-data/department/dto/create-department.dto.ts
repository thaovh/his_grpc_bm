export class CreateDepartmentDto {
    code: string;
    name: string;
    parentId?: string;
    branchId: string;
    departmentTypeId: string;
    hisId?: number;
    isAssetManagement?: number;
    createdBy?: string;
}
