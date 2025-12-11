import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MAC_MAINTENANCE_RECORD')
export class MaintenanceRecord extends BaseEntity {
    @Column({ type: 'varchar2', length: 36, name: 'MACHINE_ID' })
    machineId: string;

    @Column({ type: 'varchar2', length: 36, name: 'MAINTENANCE_TYPE_ID' })
    maintenanceTypeId: string;

    @Column({ type: 'timestamp', precision: 6, name: 'DATE' })
    date: Date;

    @Column({ type: 'varchar2', length: 255, name: 'PERFORMER', nullable: true })
    performer: string;

    @Column({ type: 'varchar2', length: 1000, name: 'DESCRIPTION', nullable: true })
    description: string;

    @Column({ type: 'number', precision: 15, scale: 2, name: 'COST', nullable: true })
    cost: number;

    @Column({ type: 'timestamp', precision: 6, name: 'NEXT_MAINTENANCE_DATE', nullable: true })
    nextMaintenanceDate: Date;
}
