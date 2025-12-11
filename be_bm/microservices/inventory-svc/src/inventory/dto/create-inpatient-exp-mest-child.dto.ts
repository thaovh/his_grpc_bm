export class CreateInpatientExpMestChildDto {
  readonly hisExpMestId: number;
  readonly aggrExpMestId: number; // Required: reference to parent exp mest
  readonly aggrExpMestLocalId?: string | null; // Optional: UUID of parent exp mest
  readonly expMestCode?: string | null;
  readonly expMestTypeId?: number | null;
  readonly expMestSttId?: number | null;
  readonly mediStockId?: number | null;
  readonly reqLoginname?: string | null;
  readonly reqUsername?: string | null;
  readonly reqRoomId?: number | null;
  readonly reqDepartmentId?: number | null;
  readonly createDate?: number | null;
  readonly tdlPatientTypeId?: number | null;
  readonly virCreateMonth?: number | null;
  readonly virCreateYear?: number | null;
  readonly reqUserTitle?: string | null;
  readonly expMestSubCode?: string | null;
  readonly expMestSubCode2?: string | null;
  readonly numOrder?: number | null;
  readonly tdlAggrPatientCode?: string | null;
  readonly tdlAggrTreatmentCode?: string | null;
  readonly expMestTypeCode?: string | null;
  readonly expMestTypeName?: string | null;
  readonly expMestSttCode?: string | null;
  readonly expMestSttName?: string | null;
  readonly mediStockCode?: string | null;
  readonly mediStockName?: string | null;
  readonly reqDepartmentCode?: string | null;
  readonly reqDepartmentName?: string | null;
  readonly tdlIntructionDateMin?: number | null;
  readonly lastExpLoginname?: string | null;
  readonly lastExpUsername?: string | null;
  readonly lastExpTime?: number | null;
  readonly finishTime?: number | null;
  readonly finishDate?: number | null;
  readonly isExportEqualApprove?: number | null;
  readonly lastApprovalLoginname?: string | null;
  readonly lastApprovalUsername?: string | null;
  readonly lastApprovalTime?: number | null;
  readonly lastApprovalDate?: number | null;
  readonly reqRoomCode?: string | null;
  readonly reqRoomName?: string | null;
  readonly groupCode?: string | null;
  readonly hisCreateTime?: number | null;
  readonly hisModifyTime?: number | null;
  readonly hisCreator?: string | null;
  readonly hisModifier?: string | null;
  // Service Request fields
  readonly serviceReqId?: number | null;
  readonly tdlTotalPrice?: number | null;
  readonly tdlServiceReqCode?: string | null;
  // Instruction fields
  readonly tdlIntructionTime?: number | null;
  readonly tdlIntructionDate?: number | null;
  // Treatment fields
  readonly tdlTreatmentId?: number | null;
  readonly tdlTreatmentCode?: string | null;
  readonly tdlAggrExpMestCode?: string | null;
  // Patient fields
  readonly tdlPatientId?: number | null;
  readonly tdlPatientCode?: string | null;
  readonly tdlPatientName?: string | null;
  readonly tdlPatientFirstName?: string | null;
  readonly tdlPatientLastName?: string | null;
  readonly tdlPatientDob?: number | null;
  readonly tdlPatientIsHasNotDayDob?: number | null;
  readonly tdlPatientAddress?: string | null;
  readonly tdlPatientGenderId?: number | null;
  readonly tdlPatientGenderName?: string | null;
  readonly tdlHeinCardNumber?: string | null;
  readonly tdlPatientPhone?: string | null;
  readonly tdlPatientProvinceCode?: string | null;
  readonly tdlPatientCommuneCode?: string | null;
  readonly tdlPatientNationalName?: string | null;
  // ICD fields
  readonly icdCode?: string | null;
  readonly icdName?: string | null;
  readonly icdSubCode?: string | null;
  readonly icdText?: string | null;
  // Other fields
  readonly virHeinCardPrefix?: string | null;
  readonly priority?: number | null;
  readonly reqHeadUsername?: string | null;
  readonly patientTypeName?: string | null;
  readonly currentBedIds?: string | null;
  readonly createdBy: string;
}

