import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MAC_TRANSFER')
export class MachineTransfer extends BaseEntity {
    @Column({ type: 'varchar2', length: 36, name: 'MACHINE_ID' })
    machineId: string;

    @Column({ type: 'varchar2', length: 36, name: 'FROM_BRANCH_ID', nullable: true })
    fromBranchId: string;

    @Column({ type: 'varchar2', length: 36, name: 'TO_BRANCH_ID', nullable: true })
    toBranchId: string;

    @Column({ type: 'varchar2', length: 36, name: 'FROM_DEPARTMENT_ID', nullable: true })
    fromDepartmentId: string;

    @Column({ type: 'varchar2', length: 36, name: 'TO_DEPARTMENT_ID', nullable: true })
    toDepartmentId: string;

    @Column({ type: 'timestamp', precision: 6, name: 'TRANSFER_DATE', nullable: true })
    transferDate: Date;

    @Column({ type: 'varchar2', length: 36, name: 'STATUS_ID' })
    statusId: string;

    @Column({ type: 'varchar2', length: 36, name: 'TRANSFER_TYPE_ID', nullable: true })
    transferTypeId: string;

    @Column({ type: 'nvarchar2', length: 500, name: 'REASON', nullable: true })
    reason: string;

    @Column({ type: 'varchar2', length: 100, name: 'REFERENCE_NUMBER', nullable: true })
    referenceNumber: string;
}
