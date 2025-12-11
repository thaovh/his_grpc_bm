import { Entity, Column, Index, Unique } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';

/**
 * ExpMestCabinetMedicine Entity - Chi tiết thuốc của phiếu xuất bù cơ số tủ trực
 * Table: EXP_EXP_MEST_CABINET_MED (25 chars - OK)
 * Service Prefix: EXP
 */
@Entity('EXP_EXP_MEST_CABINET_MED')
@Index('IDX_EXP_MEST_CAB_MED_EXP_ID', ['expMestId'])
@Index('IDX_EXP_MEST_CAB_MED_LOC', ['expMestLocalId'])
@Index('IDX_EXP_MEST_CAB_MED_MED_ID', ['medicineId'])
@Index('IDX_EXP_MEST_CAB_MED_STOCK', ['mediStockId'])
@Unique('UQ_EXP_MEST_CAB_MED_HIS', ['hisId'])
export class ExpMestCabinetMedicine extends BaseEntity {
    // Primary Key từ HIS
    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'HIS_ID',
        nullable: false,
        comment: 'Primary key from HIS system (ID from GetView1)'
    })
    hisId: number;

    // Foreign Key đến ExpMestCabinet (HIS ID)
    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'EXP_MEST_ID',
        nullable: false,
        comment: 'Reference to EXP_EXP_MEST_CABINET.EXP_MEST_ID (HIS ID)'
    })
    expMestId: number;

    // Foreign Key đến ExpMestCabinet (Local UUID) - Optional, for faster joins
    @Column({
        type: 'varchar2',
        length: 36,
        name: 'EXP_MEST_LOCAL_ID',
        nullable: true,
        comment: 'Reference to EXP_EXP_MEST_CABINET.ID (UUID) for faster local joins'
    })
    expMestLocalId: string | null;

    // Medicine Info
    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'MEDICINE_ID',
        nullable: true,
        comment: 'Medicine ID'
    })
    medicineId: number | null;

    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'TDL_MEDI_STOCK_ID',
        nullable: true,
        comment: 'Medical stock ID (TDL)'
    })
    tdlMediStockId: number | null;

    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'TDL_MEDICINE_TYPE_ID',
        nullable: true,
        comment: 'Medicine type ID (TDL)'
    })
    tdlMedicineTypeId: number | null;

    // Export Info
    @Column({
        type: 'number',
        precision: 1,
        scale: 0,
        name: 'IS_EXPORT',
        nullable: true,
        comment: 'Is export flag (1/0)'
    })
    isExport: number | null;

    @Column({
        type: 'number',
        precision: 18,
        scale: 2,
        name: 'AMOUNT',
        nullable: true,
        comment: 'Amount'
    })
    amount: number | null;

    @Column({
        type: 'number',
        precision: 18,
        scale: 2,
        name: 'EXPORT_AMOUNT',
        nullable: true,
        comment: 'Export amount'
    })
    exportAmount: number | null;

    // Export Info
    @Column({
        type: 'varchar2',
        length: 36,
        name: 'EXPORT_BY_USER',
        nullable: true,
        comment: 'User ID who exported (UUID)'
    })
    exportByUser: string | null;

    @Column({
        type: 'varchar2',
        length: 100,
        name: 'EXP_LOGINNAME',
        nullable: true,
        comment: 'Export user login name'
    })
    expLoginname: string | null;

    @Column({
        type: 'varchar2',
        length: 500,
        name: 'EXP_USERNAME',
        nullable: true,
        comment: 'Export user name'
    })
    expUsername: string | null;

    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'EXP_TIME',
        nullable: true,
        comment: 'Export time (YYYYMMDDHHMMSS)'
    })
    expTime: number | null;

    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'EXP_DATE',
        nullable: true,
        comment: 'Export date (YYYYMMDDHHMMSS)'
    })
    expDate: number | null;

    // Actual Export Info (Thực xuất)
    @Column({
        type: 'number',
        precision: 18,
        scale: 2,
        name: 'ACTUAL_EXP_AMOUNT',
        nullable: true,
        comment: 'Actual export amount (Thực xuất)'
    })
    actualExportAmount: number | null;

    @Column({
        type: 'varchar2',
        length: 36,
        name: 'ACTUAL_EXP_BY_USER',
        nullable: true,
        comment: 'User ID who actually exported (UUID)'
    })
    actualExportByUser: string | null;

    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'ACTUAL_EXP_TIME',
        nullable: true,
        comment: 'Actual export time (YYYYMMDDHHMMSS)'
    })
    actualExportTime: number | null;

    // Approval Info
    @Column({
        type: 'varchar2',
        length: 100,
        name: 'APPROVAL_LOGINNAME',
        nullable: true,
        comment: 'Approval user login name'
    })
    approvalLoginname: string | null;

    @Column({
        type: 'varchar2',
        length: 500,
        name: 'APPROVAL_USERNAME',
        nullable: true,
        comment: 'Approval user name'
    })
    approvalUsername: string | null;

    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'APPROVAL_TIME',
        nullable: true,
        comment: 'Approval time (YYYYMMDDHHMMSS)'
    })
    approvalTime: number | null;

    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'APPROVAL_DATE',
        nullable: true,
        comment: 'Approval date (YYYYMMDDHHMMSS)'
    })
    approvalDate: number | null;

    // Denormalized ExpMest Info
    @Column({
        type: 'varchar2',
        length: 50,
        name: 'EXP_MEST_CODE',
        nullable: true,
        comment: 'Export medicine code'
    })
    expMestCode: string | null;

    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'MEDI_STOCK_ID',
        nullable: true,
        comment: 'Medical stock ID'
    })
    mediStockId: number | null;

    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'EXP_MEST_STT_ID',
        nullable: true,
        comment: 'Export medicine status ID'
    })
    expMestSttId: number | null;

    // Price Info
    @Column({
        type: 'number',
        precision: 18,
        scale: 2,
        name: 'IMP_PRICE',
        nullable: true,
        comment: 'Import price'
    })
    impPrice: number | null;

    @Column({
        type: 'number',
        precision: 18,
        scale: 2,
        name: 'IMP_VAT_RATIO',
        nullable: true,
        comment: 'Import VAT ratio'
    })
    impVatRatio: number | null;

    @Column({
        type: 'number',
        precision: 18,
        scale: 2,
        name: 'PRICE',
        nullable: true,
        comment: 'Price'
    })
    price: number | null;

    @Column({
        type: 'number',
        precision: 18,
        scale: 2,
        name: 'VAT_RATIO',
        nullable: true,
        comment: 'VAT ratio'
    })
    vatRatio: number | null;

    // Medicine Type Info
    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'MEDICINE_TYPE_ID',
        nullable: true,
        comment: 'Medicine type ID'
    })
    medicineTypeId: number | null;

    @Column({
        type: 'varchar2',
        length: 50,
        name: 'MEDICINE_TYPE_CODE',
        nullable: true,
        comment: 'Medicine type code'
    })
    medicineTypeCode: string | null;

    @Column({
        type: 'varchar2',
        length: 500,
        name: 'MEDICINE_TYPE_NAME',
        nullable: true,
        comment: 'Medicine type name'
    })
    medicineTypeName: string | null;

    // Package Info
    @Column({
        type: 'varchar2',
        length: 100,
        name: 'PACKAGE_NUMBER',
        nullable: true,
        comment: 'Package number'
    })
    packageNumber: string | null;

    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'EXPIRED_DATE',
        nullable: true,
        comment: 'Expired date (YYYYMMDDHHMMSS)'
    })
    expiredDate: number | null;

    // Supplier Info
    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'SUPPLIER_ID',
        nullable: true,
        comment: 'Supplier ID'
    })
    supplierId: number | null;

    @Column({
        type: 'varchar2',
        length: 50,
        name: 'SUPPLIER_CODE',
        nullable: true,
        comment: 'Supplier code'
    })
    supplierCode: string | null;

    @Column({
        type: 'varchar2',
        length: 500,
        name: 'SUPPLIER_NAME',
        nullable: true,
        comment: 'Supplier name'
    })
    supplierName: string | null;

    // Manufacturer Info
    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'MANUFACTURER_ID',
        nullable: true,
        comment: 'Manufacturer ID'
    })
    manufacturerId: number | null;

    @Column({
        type: 'varchar2',
        length: 50,
        name: 'MANUFACTURER_CODE',
        nullable: true,
        comment: 'Manufacturer code'
    })
    manufacturerCode: string | null;

    @Column({
        type: 'varchar2',
        length: 500,
        name: 'MANUFACTURER_NAME',
        nullable: true,
        comment: 'Manufacturer name'
    })
    manufacturerName: string | null;

    // Unit Info
    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'SERVICE_UNIT_ID',
        nullable: true,
        comment: 'Service unit ID'
    })
    serviceUnitId: number | null;

    @Column({
        type: 'varchar2',
        length: 50,
        name: 'SERVICE_UNIT_CODE',
        nullable: true,
        comment: 'Service unit code'
    })
    serviceUnitCode: string | null;

    @Column({
        type: 'varchar2',
        length: 200,
        name: 'SERVICE_UNIT_NAME',
        nullable: true,
        comment: 'Service unit name'
    })
    serviceUnitName: string | null;

    // Stock Info
    @Column({
        type: 'varchar2',
        length: 50,
        name: 'MEDI_STOCK_CODE',
        nullable: true,
        comment: 'Medical stock code'
    })
    mediStockCode: string | null;

    @Column({
        type: 'varchar2',
        length: 500,
        name: 'MEDI_STOCK_NAME',
        nullable: true,
        comment: 'Medical stock name'
    })
    mediStockName: string | null;

    // Order Info
    @Column({
        type: 'number',
        precision: 10,
        scale: 0,
        name: 'NUM_ORDER',
        nullable: true,
        comment: 'Number order'
    })
    numOrder: number | null;

    // HIS timestamps
    @Column({
        type: 'number',
        precision: 18,
        scale: 0,
        name: 'HIS_CREATE_TIME',
        nullable: true,
        comment: 'HIS create time'
    })
    hisCreateTime: number | null;

    @Column({
        type: 'number',
        precision: 18,
        scale: 0,
        name: 'HIS_MODIFY_TIME',
        nullable: true,
        comment: 'HIS modify time'
    })
    hisModifyTime: number | null;

    @Column({
        type: 'varchar2',
        length: 100,
        name: 'HIS_CREATOR',
        nullable: true,
        comment: 'HIS creator'
    })
    hisCreator: string | null;

    @Column({
        type: 'varchar2',
        length: 100,
        name: 'HIS_MODIFIER',
        nullable: true,
        comment: 'HIS modifier'
    })
    hisModifier: string | null;
}
