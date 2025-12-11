import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';

/**
 * InpatientExpMest Entity - Phiếu xuất thuốc nội trú từ HIS
 * Table: EXP_INPATIENT_EXP_MEST (22 chars - OK)
 * Service Prefix: EXP
 */
@Entity('EXP_INPATIENT_EXP_MEST')
// Note: IDX_INP_EXP_MEST_ID không cần vì hisExpMestId đã có unique: true (tự động tạo unique index)
@Index('IDX_INP_EXP_MEST_CODE', ['expMestCode'])
@Index('IDX_INP_EXP_MEST_DATE', ['createDate'])
@Index('IDX_INP_WORKING_STATE', ['workingStateId'])
export class InpatientExpMest extends BaseEntity {
  // Primary Key từ HIS
  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'HIS_EXP_MEST_ID', // 17 chars - OK
    unique: true,
    nullable: false,
    comment: 'Primary key from HIS system (ID from GetView)'
  })
  hisExpMestId: number;

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
    name: 'REQ_DEPARTMENT_ID', // 19 chars - OK
    nullable: true,
    comment: 'Request department ID'
  })
  reqDepartmentId: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 0,
    name: 'CREATE_DATE', // 11 chars - OK
    nullable: true,
    comment: 'Create date'
  })
  createDate: number | null;

  @Column({
    type: 'number',
    precision: 19,
    scale: 0,
    name: 'TDL_PATIENT_TYPE_ID', // 21 chars - OK
    nullable: true,
    comment: 'Patient type ID'
  })
  tdlPatientTypeId: number | null;

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
    length: 50,
    name: 'EXP_MEST_SUB_CODE', // 18 chars - OK
    nullable: true,
    comment: 'Export medicine sub code'
  })
  expMestSubCode: string | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'EXP_MEST_SUB_CODE_2', // 20 chars - OK
    nullable: true,
    comment: 'Export medicine sub code 2'
  })
  expMestSubCode2: string | null;

  @Column({
    type: 'number',
    precision: 10,
    scale: 0,
    name: 'NUM_ORDER', // 9 chars - OK
    nullable: true,
    comment: 'Number order'
  })
  numOrder: number | null;

  // Aggregated codes
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

  // Denormalized Type Info
  @Column({
    type: 'varchar2',
    length: 10,
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

  // Denormalized Status Info
  @Column({
    type: 'varchar2',
    length: 10,
    name: 'EXP_MEST_STT_CODE', // 17 chars - OK
    nullable: true,
    comment: 'Export medicine status code'
  })
  expMestSttCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'EXP_MEST_STT_NAME', // 17 chars - OK
    nullable: true,
    comment: 'Export medicine status name'
  })
  expMestSttName: string | null;

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
    name: 'REQ_DEPARTMENT_CODE', // 20 chars - OK
    nullable: true,
    comment: 'Request department code'
  })
  reqDepartmentCode: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'REQ_DEPARTMENT_NAME', // 20 chars - OK
    nullable: true,
    comment: 'Request department name'
  })
  reqDepartmentName: string | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 0,
    name: 'TDL_INTRUCTION_DATE_MIN', // 24 chars - OK
    nullable: true,
    comment: 'Instruction date minimum'
  })
  tdlIntructionDateMin: number | null;

  // Optional fields (from HIS GetView)
  @Column({
    type: 'varchar2',
    length: 100,
    name: 'LAST_EXP_LOGINNAME', // 19 chars - OK
    nullable: true,
    comment: 'Last export login name'
  })
  lastExpLoginname: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'LAST_EXP_USERNAME', // 18 chars - OK
    nullable: true,
    comment: 'Last export user name'
  })
  lastExpUsername: string | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 0,
    name: 'LAST_EXP_TIME', // 15 chars - OK
    nullable: true,
    comment: 'Last export time'
  })
  lastExpTime: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 0,
    name: 'FINISH_TIME', // 11 chars - OK
    nullable: true,
    comment: 'Finish time'
  })
  finishTime: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 0,
    name: 'FINISH_DATE', // 11 chars - OK
    nullable: true,
    comment: 'Finish date'
  })
  finishDate: number | null;

  @Column({
    type: 'number',
    precision: 1,
    scale: 0,
    name: 'IS_EXPORT_EQUAL_APPROVE', // 23 chars - OK
    nullable: true,
    comment: 'Is export equal approve'
  })
  isExportEqualApprove: number | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'LAST_APPROVAL_LOGINNAME', // 24 chars - OK
    nullable: true,
    comment: 'Last approval login name'
  })
  lastApprovalLoginname: string | null;

  @Column({
    type: 'varchar2',
    length: 500,
    name: 'LAST_APPROVAL_USERNAME', // 23 chars - OK
    nullable: true,
    comment: 'Last approval user name'
  })
  lastApprovalUsername: string | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 0,
    name: 'LAST_APPROVAL_TIME', // 20 chars - OK
    nullable: true,
    comment: 'Last approval time'
  })
  lastApprovalTime: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 0,
    name: 'LAST_APPROVAL_DATE', // 20 chars - OK
    nullable: true,
    comment: 'Last approval date'
  })
  lastApprovalDate: number | null;

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

  @Column({
    type: 'varchar2',
    length: 50,
    name: 'GROUP_CODE', // 11 chars - OK
    nullable: true,
    comment: 'Group code'
  })
  groupCode: string | null;

  // Working State - Reference to MST_EXPORT_STATUS.id
  @Column({
    type: 'varchar2',
    length: 36, // UUID length
    name: 'WORKING_STATE_ID', // 17 chars - OK
    nullable: true,
    comment: 'Reference to MST_EXPORT_STATUS.id (working_state)'
  })
  workingStateId: string | null;

  // HIS timestamps (from HIS response)
  @Column({
    type: 'number',
    precision: 18,
    scale: 0,
    name: 'HIS_CREATE_TIME', // 17 chars - OK
    nullable: true,
    comment: 'HIS create time'
  })
  hisCreateTime: number | null;

  @Column({
    type: 'number',
    precision: 18,
    scale: 0,
    name: 'HIS_MODIFY_TIME', // 17 chars - OK
    nullable: true,
    comment: 'HIS modify time'
  })
  hisModifyTime: number | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'HIS_CREATOR', // 12 chars - OK
    nullable: true,
    comment: 'HIS creator'
  })
  hisCreator: string | null;

  @Column({
    type: 'varchar2',
    length: 100,
    name: 'HIS_MODIFIER', // 13 chars - OK
    nullable: true,
    comment: 'HIS modifier'
  })
  hisModifier: string | null;
}

