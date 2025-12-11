import {
  HisLoginRequest,
  HisLoginResponse,
  HisUserInfo,
  HisUserRoom,
  HisMediStock,
  HisExpMestStt,
  GetExpMestRequest,
  GetInpatientExpMestRequest,
} from './providers/his.provider';

// Mapped UserRoom with camelCase fields (matches proto message)
export interface UserRoom {
  id: number;
  createTime: number;
  modifyTime: number;
  creator: string;
  modifier: string;
  appCreator: string;
  appModifier: string;
  isActive: number;
  isDelete: number;
  loginname: string;
  roomId: number;
  roomCode: string;
  roomName: string;
  departmentId: number;
  roomTypeId: number;
  roomTypeCode: string;
  roomTypeName: string;
  departmentCode: string;
  departmentName: string;
  isPause: number;
  branchId: number;
  branchCode: string;
  branchName: string;
  heinMediOrgCode: string;
}

export interface IntegrationService {
  hisLogin(request: HisLoginRequest): Promise<HisLoginResponse>;
  syncUser(user: HisUserInfo, password?: string): Promise<{
    userId: string;
    created: boolean;
    username: string;
    email: string;
  }>;
  getToken(userId: string): Promise<{
    found: boolean;
    tokenCode?: string;
    renewCode?: string;
    expireTime?: string;
    loginTime?: string;
  }>;
  invalidateToken(userId: string): Promise<number>;
  renewToken(renewCode: string, userId?: string): Promise<{
    success: boolean;
    message?: string;
    tokenCode?: string;
    renewCode?: string;
    loginTime?: string;
    expireTime?: string;
    validAddress?: string;
    loginAddress?: string;
    versionApp?: string;
    machineName?: string;
    lastAccessTime?: string;
  }>;
  enrichData(username: string): Promise<{
    success: boolean;
    totalRecords: number;
    processedRecords: number;
    failedRecords: number;
    message?: string;
  }>;
  getUserRooms(userId: string): Promise<{
    success: boolean;
    message?: string;
    data?: UserRoom[];
  }>;
  reloadUserRooms(userId: string): Promise<{
    success: boolean;
    message?: string;
    data?: UserRoom[];
  }>;
  getMediStockByRoomId(roomId: number): Promise<{
    success: boolean;
    message?: string;
    id?: number | null;
    data?: MediStock | null;
  }>;
  reloadMediStock(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }>;
  getExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestStt[];
  }>;
  reloadExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }>;
  getExpMestType(): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestType[];
  }>;
  reloadExpMestType(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }>;
  getExpMests(request: {
    expMestSttIds?: number[];
    expMestTypeIds?: number[];
    impOrExpMediStockId?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
    start?: number;
    limit?: number;
    expMestCodeExact?: string;
    workingRoomId?: number;
    dataDomainFilter?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }>;
  getInpatientExpMests(request: GetInpatientExpMestRequest): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }>;
  getInpatientExpMestById(request: {
    expMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest | null;
  }>;
  getInpatientExpMestDetails(request: {
    aggrExpMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
  }>;
  getExpMestMedicines(expMestId: number): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestMedicine[];
  }>;
}

export interface MediStock {
  id: number;
  createTime: number;
  modifyTime: number;
  creator: string;
  modifier: string;
  appCreator: string;
  appModifier: string;
  isActive: number;
  isDelete: number;
  mediStockCode: string;
  mediStockName: string;
  roomId: number;
  isAllowImpSupplier: number;
  isBusiness: number;
  isAutoCreateChmsImp: number;
  isDrugStore: number;
  departmentId: number;
  roomTypeId: number;
  roomTypeCode: string;
  roomTypeName: string;
  departmentCode: string;
  departmentName: string;
  gCode: string;
}

export interface ExpMestStt {
  id: number;
  createTime: number;
  modifyTime: number;
  modifier?: string | null;
  appModifier?: string | null;
  isActive: number;
  isDelete: number;
  expMestSttCode: string;
  expMestSttName: string;
}

export interface ExpMestType {
  id: number;
  createTime: number;
  modifyTime: number;
  isActive: number;
  isDelete: number;
  expMestTypeCode: string;
  expMestTypeName: string;
}

export interface ExpMest {
  id: number;
  createTime: number;
  modifyTime: number;
  creator: string;
  modifier: string;
  appCreator: string;
  appModifier: string;
  isActive: number;
  isDelete: number;
  expMestCode: string;
  expMestTypeId: number;
  expMestSttId: number;
  mediStockId: number;
  reqLoginname: string;
  reqUsername: string;
  reqRoomId: number;
  reqDepartmentId: number;
  createDate: number;
  serviceReqId: number;
  tdlTotalPrice: number;
  tdlServiceReqCode: string;
  tdlIntructionTime: number;
  tdlIntructionDate: number;
  tdlTreatmentId: number;
  tdlTreatmentCode: string;
  tdlPatientId: number;
  tdlPatientCode: string;
  tdlPatientName: string;
  tdlPatientFirstName: string;
  tdlPatientLastName: string;
  tdlPatientDob: number;
  tdlPatientIsHasNotDayDob: number;
  tdlPatientAddress: string;
  tdlPatientGenderId: number;
  tdlPatientGenderName: string;
  tdlPatientTypeId: number;
  tdlHeinCardNumber: string;
  tdlPatientPhone: string;
  tdlPatientProvinceCode: string;
  tdlPatientCommuneCode: string;
  tdlPatientNationalName: string;
  virCreateMonth: number;
  icdCode: string;
  icdName: string;
  reqUserTitle: string;
  expMestSubCode2: string;
  virCreateYear: number;
  virHeinCardPrefix: string;
  priority: number;
  expMestTypeCode: string;
  expMestTypeName: string;
  expMestSttCode: string;
  expMestSttName: string;
  mediStockCode: string;
  mediStockName: string;
  reqDepartmentCode: string;
  reqDepartmentName: string;
  reqRoomCode: string;
  reqRoomName: string;
  treatmentIsActive: number;
  patientTypeName: string;
  patientTypeCode: string;
  icdSubCode?: string | null;
  icdText?: string | null;
  tdlPatientDistrictCode?: string | null;
  tdlAggrPatientCode?: string | null;
  tdlAggrTreatmentCode?: string | null;
  lastExpLoginname?: string | null;
  lastExpUsername?: string | null;
  lastExpTime?: number | null;
  finishTime?: number | null;
  finishDate?: number | null;
  isExportEqualApprove?: number | null;
  expMestSubCode?: string | null;
  lastApprovalLoginname?: string | null;
  lastApprovalUsername?: string | null;
  lastApprovalTime?: number | null;
  lastApprovalDate?: number | null;
  numOrder?: number | null;
  tdlIntructionDateMin?: number | null;
  groupCode?: string | null;
}

export interface ExpMestMedicine {
  id: number;
  createTime: number;
  modifyTime: number;
  creator: string;
  modifier: string;
  appCreator: string;
  appModifier: string;
  isActive: number;
  isDelete: number;
  expMestId: number;
  medicineId: number;
  tdlMediStockId: number;
  tdlMedicineTypeId: number;
  expMestMetyReqId: number;
  ckImpMestMedicineId: number;
  isExport: number;
  amount: number;
  approvalLoginname: string;
  approvalUsername: string;
  approvalTime: number;
  approvalDate: number;
  expLoginname: string;
  expUsername: string;
  expTime: number;
  expDate: number;
  expMestCode: string;
  mediStockId: number;
  expMestSttId: number;
  impPrice: number;
  impVatRatio: number;
  bidId: number;
  packageNumber: string;
  expiredDate: number;
  medicineTypeId: number;
  impTime: number;
  supplierId: number;
  medicineBytNumOrder: string;
  medicineRegisterNumber: string;
  activeIngrBhytCode: string;
  activeIngrBhytName: string;
  concentra: string;
  tdlBidGroupCode: string;
  tdlBidPackageCode: string;
  medicineTypeCode: string;
  medicineTypeName: string;
  serviceId: number;
  nationalName: string;
  manufacturerId: number;
  bytNumOrder: string;
  registerNumber: string;
  medicineGroupId: number;
  serviceUnitId: number;
  serviceUnitCode: string;
  serviceUnitName: string;
  medicineNumOrder: number;
  supplierCode: string;
  supplierName: string;
  bidNumber: string;
  bidName: string;
  medicineUseFormCode: string;
  medicineUseFormName: string;
  medicineUseFormNumOrder: number;
  sumInStock: number;
  sumByMedicineInStock: number;
  materialNumOrder?: number | null;
  // Price & Tax Info (Additional)
  price?: number | null;
  vatRatio?: number | null;
  virPrice?: number | null;
  taxRatio?: number | null;
  // Order & Amount Info
  numOrder?: number | null;
  presAmount?: number | null;
  // Patient & Treatment Info
  patientTypeId?: number | null;
  patientTypeCode?: string | null;
  patientTypeName?: string | null;
  tdlPatientId?: number | null;
  tdlTreatmentId?: number | null;
  tdlServiceReqId?: number | null;
  // Instruction & Tutorial
  useTimeTo?: number | null;
  tutorial?: string | null;
  tdlIntructionTime?: number | null;
  tdlIntructionDate?: number | null;
  htuText?: string | null;
  // Dosage Info
  morning?: string | null;
  evening?: string | null;
  // ExpMest Denormalized Info (Additional)
  expMestTypeId?: number | null;
  tdlAggrExpMestId?: number | null;
  aggrExpMestId?: number | null;
  reqRoomId?: number | null;
  reqDepartmentId?: number | null;
  reqUserTitle?: string | null;
  reqLoginname?: string | null;
  reqUsername?: string | null;
  // Medicine Group & Use Form (Additional)
  medicineUseFormId?: number | null;
  medicineLineId?: number | null;
  medicineGroupCode?: string | null;
  medicineGroupName?: string | null;
  medicineGroupNumOrder?: number | null;
  // Manufacturer & Stock Info (Additional)
  manufacturerCode?: string | null;
  manufacturerName?: string | null;
  mediStockCode?: string | null;
  mediStockName?: string | null;
}
