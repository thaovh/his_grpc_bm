import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MAC_MACHINE')
export class Machine extends BaseEntity {
    @Column({ type: 'varchar2', length: 50, name: 'CODE', unique: true })
    code: string;

    @Column({ type: 'varchar2', length: 255, name: 'NAME' })
    name: string;

    @Column({ type: 'varchar2', length: 36, name: 'CATEGORY_ID', nullable: true })
    categoryId: string;

    @Column({ type: 'varchar2', length: 36, name: 'STATUS_ID', nullable: true })
    statusId: string;

    @Column({ type: 'varchar2', length: 36, name: 'UNIT_ID', nullable: true })
    unitId: string;

    @Column({ type: 'varchar2', length: 36, name: 'VENDOR_ID', nullable: true })
    vendorId: string;

    @Column({ type: 'varchar2', length: 36, name: 'MANUFACTURER_COUNTRY_ID', nullable: true })
    manufacturerCountryId: string;

    @Column({ type: 'varchar2', length: 36, name: 'MANUFACTURER_ID', nullable: true })
    manufacturerId: string;

    @Column({ type: 'varchar2', length: 36, name: 'FUNDING_SOURCE_ID', nullable: true })
    fundingSourceId: string;

    @Column({ type: 'varchar2', length: 100, name: 'SERIAL_NUMBER', nullable: true })
    serialNumber: string;

    @Column({ type: 'varchar2', length: 100, name: 'MODEL', nullable: true })
    model: string;

    @Column({ type: 'number', precision: 4, scale: 0, name: 'MANUFACTURING_YEAR', nullable: true })
    manufacturingYear: number;

    @Column({ type: 'timestamp', precision: 6, name: 'PURCHASE_DATE', nullable: true })
    purchaseDate: Date;

    @Column({ type: 'timestamp', precision: 6, name: 'WARRANTY_EXPIRATION_DATE', nullable: true })
    warrantyExpirationDate: Date;

    @Column({ type: 'varchar2', length: 1000, name: 'DESCRIPTION', nullable: true })
    description: string;

    @Column({ type: 'varchar2', length: 36, name: 'BRANCH_ID', nullable: true })
    branchId: string;

    @Column({ type: 'varchar2', length: 36, name: 'DEPARTMENT_ID', nullable: true })
    departmentId: string;

    @Column({ type: 'varchar2', length: 36, name: 'MANAGEMENT_DEPARTMENT_ID', nullable: true })
    managementDepartmentId: string;
}
