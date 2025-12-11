import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';
import { ExpMestMedicine } from './exp-mest-medicine.entity';

/**
 * ExpMest Entity - Đơn xuất thuốc từ HIS
 * Table: EXP_EXP_MEST (12 chars - OK)
 * Service Prefix: EXP
 */
@Entity('EXP_EXP_MEST')
@Index('IDX_EXP_MEST_CODE', ['expMestCode'])
@Index('IDX_EXP_MEST_DATE', ['createDate'])
@Index('IDX_EXP_PATIENT_ID', ['tdlPatientId'])
@Index('IDX_EXP_TREATMENT_ID', ['tdlTreatmentId'])
export class ExpMest extends BaseEntity {
  // Primary Key từ HIS
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'EXP_MEST_ID', // 12 chars - OK
    unique: true,
    nullable: false,
    comment: 'Primary key from HIS system'
  })
  expMestId: number;

  // Basic Info
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
    name: 'EXP_MEST_TYPE_ID', // 17 chars - OK
    nullable: true,
    comment: 'Export medicine type ID'
  })
  expMestTypeId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'EXP_MEST_STT_ID', // 15 chars - OK
    nullable: true,
    comment: 'Export medicine status ID'
  })
  expMestSttId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'MEDI_STOCK_ID', // 14 chars - OK
    nullable: true,
    comment: 'Medical stock ID'
  })
  mediStockId: number | null;

  // Request Info
  @Column({
    type: 'varchar2',
    length: 100,
    name: 'REQ_LOGINNAME', // 14 chars - OK
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
    name: 'REQ_DEPT_ID', // 13 chars - OK (rút gọn từ DEPARTMENT)
    nullable: true,
    comment: 'Request department ID'
  })
  reqDepartmentId: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'CREATE_DATE', // 11 chars - OK
    nullable: true,
    comment: 'Create date (YYYYMMDDHHMMSS)'
  })
  createDate: number | null;

  // Export timing and approval info from HIS
  @Column({
    type: 'varchar2',
    length: 100,
    name: 'LAST_EXP_LOGINNAME',
    nullable: true,
    comment: 'Last export login name'
  })
  lastExpLoginname: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'LAST_EXP_USERNAME',
    nullable: true,
    comment: 'Last export user name'
  })
  lastExpUsername: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'LAST_EXP_TIME',
    nullable: true,
    comment: 'Last export time (YYYYMMDDHHMMSS)'
  })
  lastExpTime: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'FINISH_TIME',
    nullable: true,
    comment: 'Finish time (YYYYMMDDHHMMSS)'
  })
  finishTime: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'FINISH_DATE',
    nullable: true,
    comment: 'Finish date (YYYYMMDDHHMMSS)'
  })
  finishDate: number | null;

  @Column({
    type: 'number',
    precision: 1,
    scale: 0,
    name: 'IS_EXPORT_EQUAL_APPROVE',
    nullable: true,
    comment: 'Flag export equals approve'
  })
  isExportEqualApprove: number | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'EXP_MEST_SUB_CODE',
    nullable: true,
    comment: 'Export medicine sub code'
  })
  expMestSubCode: string | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'LAST_APPROVAL_LOGINNAME',
    nullable: true,
    comment: 'Last approval login name'
  })
  lastApprovalLoginname: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'LAST_APPROVAL_USERNAME',
    nullable: true,
    comment: 'Last approval user name'
  })
  lastApprovalUsername: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'LAST_APPROVAL_TIME',
    nullable: true,
    comment: 'Last approval time (YYYYMMDDHHMMSS)'
  })
  lastApprovalTime: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'LAST_APPROVAL_DATE',
    nullable: true,
    comment: 'Last approval date (YYYYMMDDHHMMSS)'
  })
  lastApprovalDate: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'SERVICE_REQ_ID', // 14 chars - OK
    nullable: true,
    comment: 'Service request ID'
  })
  serviceReqId: number | null;

  // Total Price
  @Column({
    type: 'number',
    precision: 18,
    scale: 2,
    name: 'TDL_TOTAL_PRICE', // 15 chars - OK
    nullable: true,
    comment: 'Total price'
  })
  tdlTotalPrice: number | null;

  // Service Request Info
  @Column({
    type: 'varchar2',
    length: 50,
    name: 'TDL_SVC_REQ_CODE', // 17 chars - OK (rút gọn SERVICE)
    nullable: true,
    comment: 'Service request code'
  })
  tdlServiceReqCode: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_INSTR_TIME', // 15 chars - OK (rút gọn INTRUCTION)
    nullable: true,
    comment: 'Instruction time (YYYYMMDDHHMMSS)'
  })
  tdlIntructionTime: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_INSTR_DATE', // 15 chars - OK
    nullable: true,
    comment: 'Instruction date (YYYYMMDD)'
  })
  tdlIntructionDate: number | null;

  // Treatment Info
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_TREATMENT_ID', // 17 chars - OK
    nullable: true,
    comment: 'Treatment ID'
  })
  tdlTreatmentId: number | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'TDL_TREATMENT_CODE', // 18 chars - OK
    nullable: true,
    comment: 'Treatment code'
  })
  tdlTreatmentCode: string | null;

  // Patient Info - TDL_PATIENT_*
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_PATIENT_ID', // 16 chars - OK
    nullable: true,
    comment: 'Patient ID'
  })
  tdlPatientId: number | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'TDL_PATIENT_CODE', // 17 chars - OK
    nullable: true,
    comment: 'Patient code'
  })
  tdlPatientCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'TDL_PATIENT_NAME', // 18 chars - OK
    nullable: true,
    comment: 'Patient full name'
  })
  tdlPatientName: string | null;

  @Column({
    type: 'varchar2',
    length: 255,
    name: 'TDL_PAT_FIRST_NAME', // 19 chars - OK (rút gọn PATIENT)
    nullable: true,
    comment: 'Patient first name'
  })
  tdlPatientFirstName: string | null;

  @Column({
    type: 'varchar2',
    length: 255,
    name: 'TDL_PAT_LAST_NAME', // 18 chars - OK
    nullable: true,
    comment: 'Patient last name'
  })
  tdlPatientLastName: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_PATIENT_DOB', // 16 chars - OK
    nullable: true,
    comment: 'Patient date of birth (YYYYMMDD)'
  })
  tdlPatientDob: number | null;

  @Column({
    type: 'number',
    precision: 1,
    scale: 0,
    name: 'TDL_PAT_NO_DAY_DOB', // 18 chars - OK (rút gọn IS_HAS_NOT)
    nullable: true,
    comment: 'Patient has no day DOB flag'
  })
  tdlPatientIsHasNotDayDob: number | null;

  @Column({
    type: 'varchar2',
    length: 1000,
    name: 'TDL_PATIENT_ADDRESS', // 20 chars - OK
    nullable: true,
    comment: 'Patient address'
  })
  tdlPatientAddress: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_PAT_GENDER_ID', // 18 chars - OK
    nullable: true,
    comment: 'Patient gender ID'
  })
  tdlPatientGenderId: number | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'TDL_PAT_GENDER_NAME', // 20 chars - OK
    nullable: true,
    comment: 'Patient gender name'
  })
  tdlPatientGenderName: string | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_PATIENT_TYPE_ID', // 20 chars - OK
    nullable: true,
    comment: 'Patient type ID'
  })
  tdlPatientTypeId: number | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'TDL_HEIN_CARD_NUMBER', // 20 chars - OK
    nullable: true,
    comment: 'Health insurance card number'
  })
  tdlHeinCardNumber: string | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'TDL_PATIENT_PHONE', // 18 chars - OK
    nullable: true,
    comment: 'Patient phone number'
  })
  tdlPatientPhone: string | null;

  @Column({
    type: 'varchar2',
    length: 20,
    name: 'TDL_PAT_PROV_CODE', // 18 chars - OK (rút gọn PROVINCE)
    nullable: true,
    comment: 'Patient province code'
  })
  tdlPatientProvinceCode: string | null;

  @Column({
    type: 'varchar2',
    length: 20,
    name: 'TDL_PAT_COMMUNE_CODE', // 21 chars - OK
    nullable: true,
    comment: 'Patient commune code'
  })
  tdlPatientCommuneCode: string | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'TDL_PAT_NAT_NAME', // 18 chars - OK (rút gọn NATIONAL)
    nullable: true,
    comment: 'Patient nationality name'
  })
  tdlPatientNationalName: string | null;

  // Virtual Fields
  @Column({
    type: 'number',
    precision: 18,
    scale: 0,
    name: 'VIR_CREATE_MONTH', // 17 chars - OK
    nullable: true,
    comment: 'Virtual create month (YYYYMM000000)'
  })
  virCreateMonth: number | null;

  @Column({
    type: 'number',
    precision: 10,
    scale: 0,
    name: 'VIR_CREATE_YEAR', // 16 chars - OK
    nullable: true,
    comment: 'Virtual create year'
  })
  virCreateYear: number | null;

  // Aggregated codes (patient/treatment) - concatenated list, can be long
  @Column({
    type: 'varchar2',
    length: 4000,
    name: 'TDL_AGGR_PATIENT_CODE', // 22 chars - OK
    nullable: true,
    comment: 'Aggregated patient codes (semicolon separated)'
  })
  tdlAggrPatientCode: string | null;

  @Column({
    type: 'varchar2',
    length: 4000,
    name: 'TDL_AGGR_TREATMENT_CODE', // 24 chars - OK
    nullable: true,
    comment: 'Aggregated treatment codes (semicolon separated)'
  })
  tdlAggrTreatmentCode: string | null;

  // ICD Info
  @Column({
    type: 'varchar2',
    length: 50,
    name: 'ICD_CODE', // 9 chars - OK
    nullable: true,
    comment: 'ICD code'
  })
  icdCode: string | null;

  @Column({
    type: 'varchar2',
    length: 2000,
    name: 'ICD_NAME', // 8 chars - OK
    nullable: true,
    comment: 'ICD name'
  })
  icdName: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'ICD_SUB_CODE', // 12 chars - OK
    nullable: true,
    comment: 'ICD sub code'
  })
  icdSubCode: string | null;

  @Column({
    type: 'varchar2',
    length: 2000,
    name: 'ICD_TEXT', // 8 chars - OK
    nullable: true,
    comment: 'ICD text'
  })
  icdText: string | null;

  // User Title
  @Column({
    type: 'varchar2',
    length: 255,
    name: 'REQ_USER_TITLE', // 15 chars - OK
    nullable: true,
    comment: 'Request user title'
  })
  reqUserTitle: string | null;

  // Sub Code
  @Column({
    type: 'varchar2',
    length: 200,
    name: 'EXP_MEST_SUB_CODE2', // 20 chars - OK (rút gọn _2)
    nullable: true,
    comment: 'Export medicine sub code 2'
  })
  expMestSubCode2: string | null;

  // Card Prefix
  @Column({
    type: 'varchar2',
    length: 20,
    name: 'VIR_HEIN_CARD_PREFIX', // 21 chars - OK
    nullable: true,
    comment: 'Health insurance card prefix'
  })
  virHeinCardPrefix: string | null;

  // Priority
  @Column({
    type: 'number',
    precision: 10,
    scale: 0,
    name: 'PRIORITY', // 8 chars - OK
    nullable: true,
    comment: 'Priority'
  })
  priority: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'NUM_ORDER',
    nullable: true,
    comment: 'Order number'
  })
  numOrder: number | null;

  // Denormalized Type Info
  @Column({
    type: 'varchar2',
    length: 50,
    name: 'EXP_MEST_TYPE_CODE', // 19 chars - OK
    nullable: true,
    comment: 'Export medicine type code'
  })
  expMestTypeCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'EXP_MEST_TYPE_NAME', // 19 chars - OK
    nullable: true,
    comment: 'Export medicine type name'
  })
  expMestTypeName: string | null;

  // Denormalized Status Info (from HIS)
  @Column({
    type: 'varchar2',
    length: 50,
    name: 'EXP_MEST_STT_CODE', // 17 chars - OK
    nullable: true,
    comment: 'Export medicine status code from HIS'
  })
  expMestSttCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'EXP_MEST_STT_NAME', // 17 chars - OK
    nullable: true,
    comment: 'Export medicine status name from HIS'
  })
  expMestSttName: string | null;

  // Local DB Export Status Reference
  @Column({
    type: 'varchar2',
    length: 36, // UUID length
    name: 'EXPORT_STATUS_ID', // 16 chars - OK
    nullable: true,
    comment: 'Reference to MST_EXPORT_STATUS.id (local DB)'
  })
  exportStatusId: string | null;

  // Denormalized Stock Info
  @Column({
    type: 'varchar2',
    length: 50,
    name: 'MEDI_STOCK_CODE', // 16 chars - OK
    nullable: true,
    comment: 'Medical stock code'
  })
  mediStockCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'MEDI_STOCK_NAME', // 16 chars - OK
    nullable: true,
    comment: 'Medical stock name'
  })
  mediStockName: string | null;

  // Denormalized Department Info
  @Column({
    type: 'varchar2',
    length: 50,
    name: 'REQ_DEPT_CODE', // 15 chars - OK
    nullable: true,
    comment: 'Request department code'
  })
  reqDepartmentCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'REQ_DEPT_NAME', // 15 chars - OK
    nullable: true,
    comment: 'Request department name'
  })
  reqDepartmentName: string | null;

  // Denormalized Room Info
  @Column({
    type: 'varchar2',
    length: 50,
    name: 'REQ_ROOM_CODE', // 14 chars - OK
    nullable: true,
    comment: 'Request room code'
  })
  reqRoomCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'REQ_ROOM_NAME', // 14 chars - OK
    nullable: true,
    comment: 'Request room name'
  })
  reqRoomName: string | null;

  // Treatment Status
  @Column({
    type: 'number',
    precision: 1,
    scale: 0,
    name: 'TREATMENT_IS_ACTIVE', // 20 chars - OK
    nullable: true,
    comment: 'Treatment is active flag'
  })
  treatmentIsActive: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_INTRUCTION_DATE_MIN',
    nullable: true,
    comment: 'Minimum instruction date/time'
  })
  tdlIntructionDateMin: number | null;

  // Denormalized Patient Type Info
  @Column({
    type: 'varchar2',
    length: 100,
    name: 'PATIENT_TYPE_NAME', // 17 chars - OK
    nullable: true,
    comment: 'Patient type name'
  })
  patientTypeName: string | null;

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'PATIENT_TYPE_CODE', // 17 chars - OK
    nullable: true,
    comment: 'Patient type code'
  })
  patientTypeCode: string | null;

  // Relationship với ExpMestMedicine (One-to-Many)
  @OneToMany(() => ExpMestMedicine, medicine => medicine.expMest, {
    cascade: false, // Không cascade vì join qua HIS ID
  })
  medicines?: ExpMestMedicine[];
}

