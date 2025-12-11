import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';

@Entity('ATT_RECORDS')
export class AttendanceRecord extends BaseEntity {
    @Column({ type: 'varchar2', length: 50, name: 'EMPLOYEE_CODE' })
    employeeCode: string;

    @Column({ type: 'varchar2', length: 100, name: 'DEVICE_ID', nullable: true })
    deviceId: string;

    @Column({ type: 'varchar2', length: 20, name: 'EVENT_TYPE', nullable: true })
    eventType: string;

    @Column({ type: 'timestamp', name: 'EVENT_TIMESTAMP' })
    eventTimestamp: Date;

    @Column({ type: 'varchar2', length: 500, name: 'IMAGE_URL', nullable: true })
    imageUrl: string;

    @Column({ type: 'number', name: 'VERIFIED', default: 0 })
    verified: number;

    @Column({ type: 'clob', name: 'RAW_DATA', nullable: true })
    rawData: string;
}
