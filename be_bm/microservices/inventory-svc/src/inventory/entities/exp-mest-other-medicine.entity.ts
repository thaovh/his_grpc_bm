import { Entity, Column, Index, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';
import { ExpMestOther } from './exp-mest-other.entity';

/**
 * ExpMestOtherMedicine Entity - Chi tiết thuốc của phiếu xuất thuốc khác từ HIS GetView1
 * Table: EXP_EXP_MEST_OTHER_MED (22 chars - OK)
 * Service Prefix: EXP
 */
@Entity('EXP_EXP_MEST_OTHER_MED')
@Index('IDX_EXP_MEST_OTHER_MED_EXP_ID', ['expMestId'])
@Index('IDX_EXP_MEST_OTHER_MED_LOC', ['expMestLocalId'])
@Index('IDX_EXP_MEST_OTHER_MED_MED_ID', ['medicineId'])
@Index('IDX_EXP_MEST_OTHER_MED_STOCK', ['mediStockId'])
@Unique('UQ_EXP_MEST_OTHER_MED_HIS', ['hisId'])
export class ExpMestOtherMedicine extends BaseEntity {
  // Primary Key từ HIS
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'HIS_ID', // 7 chars - OK
    nullable: false,
    comment: 'Primary key from HIS system (ID from GetView1)'
  })
  hisId: number;

  // Foreign Key đến ExpMestOther (HIS ID)
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'EXP_MEST_ID', // 12 chars - OK
    nullable: false,
    comment: 'Reference to EXP_EXP_MEST_OTHER.HIS_EXP_MEST_ID (HIS ID)'
  })
  expMestId: number;

  // Foreign Key đến ExpMestOther (Local UUID) - Optional, for faster joins
  @Column({
    type: 'varchar2',
    length: 36,
    name: 'EXP_MEST_LOCAL_ID', // 18 chars - OK
    nullable: true,
    comment: 'Reference to EXP_EXP_MEST_OTHER.ID (UUID) for faster local joins'
  })
  expMestLocalId: string | null;

  // Medicine Info
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'MEDICINE_ID', // 12 chars - OK
    nullable: true,
    comment: 'Medicine ID'
  })
  medicineId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_MEDI_STOCK_ID', // 18 chars - OK
    nullable: true,
    comment: 'Medical stock ID (TDL)'
  })
  tdlMediStockId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_MEDICINE_TYPE_ID', // 22 chars - OK
    nullable: true,
    comment: 'Medicine type ID (TDL)'
  })
  tdlMedicineTypeId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'EXP_MEST_METY_REQ_ID', // 20 chars - OK
    nullable: true,
    comment: 'Export medicine type request ID'
  })
  expMestMetyReqId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'CK_IMP_MEST_MED_ID', // 19 chars - OK
    nullable: true,
    comment: 'Check import medicine ID'
  })
  ckImpMestMedicineId: number | null;

  // Export Info
  @Column({
    type: 'number',
    precision: 1,
    scale: 0,
    name: 'IS_EXPORT', // 9 chars - OK
    nullable: true,
    comment: 'Is export flag (1/0)'
  })
  isExport: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'AMOUNT', // 6 chars - OK
    nullable: true,
    comment: 'Amount'
  })
  amount: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'EXPORT_AMOUNT', // 13 chars - OK
    nullable: true,
    comment: 'Export amount'
  })
  exportAmount: number | null;

  @Column({
    type: 'varchar2',
    length: 36,
    name: 'EXPORT_BY_USER', // 14 chars - OK
    nullable: true,
    comment: 'User ID who exported (UUID)'
  })
  exportByUser: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'EXPORT_TIME', // 11 chars - OK
    nullable: true,
    comment: 'Export time (YYYYMMDDHHMMSS)'
  })
  exportTime: number | null;

  // Actual Export Info (Thực xuất)
  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'ACTUAL_EXP_AMOUNT', // 17 chars - OK
    nullable: true,
    comment: 'Actual export amount (Thực xuất)'
  })
  actualExportAmount: number | null;

  @Column({
    type: 'varchar2',
    length: 36,
    name: 'ACTUAL_EXP_BY_USER', // 18 chars - OK
    nullable: true,
    comment: 'User ID who actually exported (UUID)'
  })
  actualExportByUser: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'ACTUAL_EXP_TIME', // 15 chars - OK
    nullable: true,
    comment: 'Actual export time (YYYYMMDDHHMMSS)'
  })
  actualExportTime: number | null;

  // Approval Info
  @Column({
    type: 'varchar2',
    length: 100,
    name: 'APPROVAL_LOGINNAME', // 19 chars - OK
    nullable: true,
    comment: 'Approval user login name'
  })
  approvalLoginname: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'APPROVAL_USERNAME', // 18 chars - OK
    nullable: true,
    comment: 'Approval user name'
  })
  approvalUsername: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'APPROVAL_TIME', // 13 chars - OK
    nullable: true,
    comment: 'Approval time (YYYYMMDDHHMMSS)'
  })
  approvalTime: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'APPROVAL_DATE', // 13 chars - OK
    nullable: true,
    comment: 'Approval date (YYYYMMDDHHMMSS)'
  })
  approvalDate: number | null;

  // Export User Info
  @Column({
    type: 'varchar2',
    length: 100,
    name: 'EXP_LOGINNAME', // 14 chars - OK
    nullable: true,
    comment: 'Export user login name'
  })
  expLoginname: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'EXP_USERNAME', // 12 chars - OK
    nullable: true,
    comment: 'Export user name'
  })
  expUsername: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'EXP_TIME', // 8 chars - OK
    nullable: true,
    comment: 'Export time (YYYYMMDDHHMMSS)'
  })
  expTime: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'EXP_DATE', // 8 chars - OK
    nullable: true,
    comment: 'Export date (YYYYMMDDHHMMSS)'
  })
  expDate: number | null;

  // Denormalized ExpMest Info
  @Column({
    type: 'varchar2',
    length: 50,
    name: 'EXP_MEST_CODE', // 14 chars - OK
    nullable: true,
    comment: 'Export medicine code'
  })
  expMestCode: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'MEDI_STOCK_ID', // 14 chars - OK
    nullable: true,
    comment: 'Medical stock ID'
  })
  mediStockId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'EXP_MEST_STT_ID', // 15 chars - OK
    nullable: true,
    comment: 'Export medicine status ID'
  })
  expMestSttId: number | null;

  // Price Info
  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'IMP_PRICE', // 9 chars - OK
    nullable: true,
    comment: 'Import price'
  })
  impPrice: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'IMP_VAT_RATIO', // 13 chars - OK
    nullable: true,
    comment: 'Import VAT ratio'
  })
  impVatRatio: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'PRICE', // 5 chars - OK
    nullable: true,
    comment: 'Price'
  })
  price: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'VAT_RATIO', // 9 chars - OK
    nullable: true,
    comment: 'VAT ratio'
  })
  vatRatio: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'VIR_PRICE', // 9 chars - OK
    nullable: true,
    comment: 'Virtual price'
  })
  virPrice: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'TAX_RATIO', // 9 chars - OK
    nullable: true,
    comment: 'Tax ratio'
  })
  taxRatio: number | null;

  // Bid/Package Info
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'BID_ID', // 6 chars - OK
    nullable: true,
    comment: 'Bid ID'
  })
  bidId: number | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'PACKAGE_NUMBER', // 15 chars - OK
    nullable: true,
    comment: 'Package number'
  })
  packageNumber: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'EXPIRED_DATE', // 13 chars - OK
    nullable: true,
    comment: 'Expired date (YYYYMMDDHHMMSS)'
  })
  expiredDate: number | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'TDL_BID_GROUP_CODE', // 19 chars - OK
    nullable: true,
    comment: 'Bid group code (TDL)'
  })
  tdlBidGroupCode: string | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'TDL_BID_PACKAGE_CODE', // 21 chars - OK
    nullable: true,
    comment: 'Bid package code (TDL)'
  })
  tdlBidPackageCode: string | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'BID_NUMBER', // 11 chars - OK
    nullable: true,
    comment: 'Bid number'
  })
  bidNumber: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'BID_NAME', // 9 chars - OK
    nullable: true,
    comment: 'Bid name'
  })
  bidName: string | null;

  // Medicine Type Info
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'MEDICINE_TYPE_ID', // 17 chars - OK
    nullable: true,
    comment: 'Medicine type ID'
  })
  medicineTypeId: number | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'MEDICINE_TYPE_CODE', // 19 chars - OK
    nullable: true,
    comment: 'Medicine type code'
  })
  medicineTypeCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'MEDICINE_TYPE_NAME', // 19 chars - OK
    nullable: true,
    comment: 'Medicine type name'
  })
  medicineTypeName: string | null;

  // Import Info
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'IMP_TIME', // 8 chars - OK
    nullable: true,
    comment: 'Import time (YYYYMMDDHHMMSS)'
  })
  impTime: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'SUPPLIER_ID', // 12 chars - OK
    nullable: true,
    comment: 'Supplier ID'
  })
  supplierId: number | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'SUPPLIER_CODE', // 13 chars - OK
    nullable: true,
    comment: 'Supplier code'
  })
  supplierCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'SUPPLIER_NAME', // 13 chars - OK
    nullable: true,
    comment: 'Supplier name'
  })
  supplierName: string | null;

  // Medicine Details
  @Column({
    type: 'varchar2',
    length: 100,
    name: 'MEDICINE_BYT_NUM_ORDER', // 22 chars - OK
    nullable: true,
    comment: 'Medicine BYT number order'
  })
  medicineBytNumOrder: string | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'MED_REGISTER_NUMBER', // 20 chars - OK
    nullable: true,
    comment: 'Medicine register number'
  })
  medicineRegisterNumber: string | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'ACTIVE_INGR_BHYT_CODE', // 22 chars - OK
    nullable: true,
    comment: 'Active ingredient BHYT code'
  })
  activeIngrBhytCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'ACTIVE_INGR_BHYT_NAME', // 22 chars - OK
    nullable: true,
    comment: 'Active ingredient BHYT name'
  })
  activeIngrBhytName: string | null;

  @Column({
    type: 'varchar2',
    length: 2000,
    name: 'CONCENTRA', // 10 chars - OK
    nullable: true,
    comment: 'Concentration'
  })
  concentra: string | null;

  @Column({
    type: 'number',
    precision: 10,
    scale: 0,
    name: 'MATERIAL_NUM_ORDER', // 18 chars - OK
    nullable: true,
    comment: 'Material number order'
  })
  materialNumOrder: number | null;

  // Service Info
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'SERVICE_ID', // 11 chars - OK
    nullable: true,
    comment: 'Service ID'
  })
  serviceId: number | null;

  @Column({
    type: 'varchar2',
    length: 200,
    name: 'NATIONAL_NAME', // 13 chars - OK
    nullable: true,
    comment: 'National name'
  })
  nationalName: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'MANUFACTURER_ID', // 15 chars - OK
    nullable: true,
    comment: 'Manufacturer ID'
  })
  manufacturerId: number | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'MANUFACTURER_CODE', // 18 chars - OK
    nullable: true,
    comment: 'Manufacturer code'
  })
  manufacturerCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'MANUFACTURER_NAME', // 18 chars - OK
    nullable: true,
    comment: 'Manufacturer name'
  })
  manufacturerName: string | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'BYT_NUM_ORDER', // 13 chars - OK
    nullable: true,
    comment: 'BYT number order'
  })
  bytNumOrder: string | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'REGISTER_NUMBER', // 15 chars - OK
    nullable: true,
    comment: 'Register number'
  })
  registerNumber: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'MEDICINE_GROUP_ID', // 18 chars - OK
    nullable: true,
    comment: 'Medicine group ID'
  })
  medicineGroupId: number | null;

  @Column({
    type: 'varchar2',
    length: 10,
    name: 'MED_GROUP_CODE', // 16 chars - OK
    nullable: true,
    comment: 'Medicine group code'
  })
  medicineGroupCode: string | null;

  @Column({
    type: 'varchar2',
    length: 200,
    name: 'MED_GROUP_NAME', // 16 chars - OK
    nullable: true,
    comment: 'Medicine group name'
  })
  medicineGroupName: string | null;

  @Column({
    type: 'number',
    precision: 10,
    scale: 0,
    name: 'MED_GROUP_NUM_ORDER', // 20 chars - OK
    nullable: true,
    comment: 'Medicine group number order'
  })
  medicineGroupNumOrder: number | null;

  // Unit Info
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'SERVICE_UNIT_ID', // 16 chars - OK
    nullable: true,
    comment: 'Service unit ID'
  })
  serviceUnitId: number | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'SERVICE_UNIT_CODE', // 17 chars - OK
    nullable: true,
    comment: 'Service unit code'
  })
  serviceUnitCode: string | null;

  @Column({
    type: 'varchar2',
    length: 200,
    name: 'SERVICE_UNIT_NAME', // 17 chars - OK
    nullable: true,
    comment: 'Service unit name'
  })
  serviceUnitName: string | null;

  @Column({
    type: 'number',
    precision: 10,
    scale: 0,
    name: 'MEDICINE_NUM_ORDER', // 19 chars - OK
    nullable: true,
    comment: 'Medicine number order'
  })
  medicineNumOrder: number | null;

  // Use Form Info
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'MED_USE_FORM_ID', // 17 chars - OK
    nullable: true,
    comment: 'Medicine use form ID'
  })
  medicineUseFormId: number | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'MED_USE_FORM_CODE', // 19 chars - OK
    nullable: true,
    comment: 'Medicine use form code'
  })
  medicineUseFormCode: string | null;

  @Column({
    type: 'varchar2',
    length: 200,
    name: 'MED_USE_FORM_NAME', // 19 chars - OK
    nullable: true,
    comment: 'Medicine use form name'
  })
  medicineUseFormName: string | null;

  @Column({
    type: 'number',
    precision: 10,
    scale: 0,
    name: 'MED_USE_FORM_NUM_ORDER', // 23 chars - OK
    nullable: true,
    comment: 'Medicine use form number order'
  })
  medicineUseFormNumOrder: number | null;

  // Stock Info
  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'SUM_IN_STOCK', // 14 chars - OK
    nullable: true,
    comment: 'Sum in stock'
  })
  sumInStock: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'SUM_BY_MED_IN_STOCK', // 20 chars - OK
    nullable: true,
    comment: 'Sum by medicine in stock'
  })
  sumByMedicineInStock: number | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'MEDI_STOCK_CODE', // 17 chars - OK
    nullable: true,
    comment: 'Medical stock code'
  })
  mediStockCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'MEDI_STOCK_NAME', // 17 chars - OK
    nullable: true,
    comment: 'Medical stock name'
  })
  mediStockName: string | null;

  // Order & Amount Info
  @Column({
    type: 'number',
    precision: 10,
    scale: 0,
    name: 'NUM_ORDER', // 9 chars - OK
    nullable: true,
    comment: 'Number order'
  })
  numOrder: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'PRES_AMOUNT', // 11 chars - OK
    nullable: true,
    comment: 'Prescription amount'
  })
  presAmount: number | null;

  // Patient & Treatment Info
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'PATIENT_TYPE_ID', // 16 chars - OK
    nullable: true,
    comment: 'Patient type ID'
  })
  patientTypeId: number | null;

  @Column({
    type: 'varchar2',
    length: 10,
    name: 'PATIENT_TYPE_CODE', // 18 chars - OK
    nullable: true,
    comment: 'Patient type code'
  })
  patientTypeCode: string | null;

  @Column({
    type: 'varchar2',
    length: 200,
    name: 'PATIENT_TYPE_NAME', // 18 chars - OK
    nullable: true,
    comment: 'Patient type name'
  })
  patientTypeName: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_PATIENT_ID', // 16 chars - OK
    nullable: true,
    comment: 'Patient ID (TDL)'
  })
  tdlPatientId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_TREATMENT_ID', // 18 chars - OK
    nullable: true,
    comment: 'Treatment ID (TDL)'
  })
  tdlTreatmentId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_SERVICE_REQ_ID', // 20 chars - OK
    nullable: true,
    comment: 'Service request ID (TDL)'
  })
  tdlServiceReqId: number | null;

  // Instruction & Tutorial
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'USE_TIME_TO', // 11 chars - OK
    nullable: true,
    comment: 'Use time to (YYYYMMDDHHMMSS)'
  })
  useTimeTo: number | null;

  @Column({
    type: 'varchar2',
    length: 2000,
    name: 'TUTORIAL', // 8 chars - OK
    nullable: true,
    comment: 'Tutorial/instruction text'
  })
  tutorial: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_INTRUCTION_TIME', // 22 chars - OK
    nullable: true,
    comment: 'Instruction time (YYYYMMDDHHMMSS)'
  })
  tdlIntructionTime: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_INTRUCTION_DATE', // 22 chars - OK
    nullable: true,
    comment: 'Instruction date (YYYYMMDDHHMMSS)'
  })
  tdlIntructionDate: number | null;

  @Column({
    type: 'varchar2',
    length: 200,
    name: 'HTU_TEXT', // 9 chars - OK
    nullable: true,
    comment: 'HTU text'
  })
  htuText: string | null;

  // Dosage Info
  @Column({
    type: 'varchar2',
    length: 10,
    name: 'MORNING', // 7 chars - OK
    nullable: true,
    comment: 'Morning dosage'
  })
  morning: string | null;

  @Column({
    type: 'varchar2',
    length: 10,
    name: 'EVENING', // 7 chars - OK
    nullable: true,
    comment: 'Evening dosage'
  })
  evening: string | null;

  // ExpMest Denormalized Info
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'EXP_MEST_TYPE_ID', // 18 chars - OK
    nullable: true,
    comment: 'Export medicine type ID'
  })
  expMestTypeId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_AGGR_EXP_MEST_ID', // 22 chars - OK
    nullable: true,
    comment: 'Aggregated export medicine ID (TDL)'
  })
  tdlAggrExpMestId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'AGGR_EXP_MEST_ID', // 17 chars - OK
    nullable: true,
    comment: 'Aggregated export medicine ID'
  })
  aggrExpMestId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'REQ_ROOM_ID', // 12 chars - OK
    nullable: true,
    comment: 'Request room ID'
  })
  reqRoomId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'REQ_DEPARTMENT_ID', // 19 chars - OK
    nullable: true,
    comment: 'Request department ID'
  })
  reqDepartmentId: number | null;

  @Column({
    type: 'varchar2',
    length: 200,
    name: 'REQ_USER_TITLE', // 15 chars - OK
    nullable: true,
    comment: 'Request user title'
  })
  reqUserTitle: string | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'REQ_LOGINNAME', // 15 chars - OK
    nullable: true,
    comment: 'Request user login name'
  })
  reqLoginname: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'REQ_USERNAME', // 13 chars - OK
    nullable: true,
    comment: 'Request user name'
  })
  reqUsername: string | null;

  // Medicine Line
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'MED_LINE_ID', // 13 chars - OK
    nullable: true,
    comment: 'Medicine line ID'
  })
  medicineLineId: number | null;

  // Relationship với ExpMestOther (Many-to-One)
  @ManyToOne(() => ExpMestOther, {
    createForeignKeyConstraints: false, // Vì join có thể qua HIS ID hoặc UUID
  })
  @JoinColumn({
    name: 'EXP_MEST_LOCAL_ID',
    referencedColumnName: 'id', // Join qua UUID local (nếu có)
  })
  expMestOther?: ExpMestOther;
}

