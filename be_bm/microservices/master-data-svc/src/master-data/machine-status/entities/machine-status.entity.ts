import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MST_MACHINE_STATUS')
export class MachineStatus extends BaseEntity {
    @Column({ name: 'CODE', type: 'varchar2', length: 50, unique: true })
    code: string;

    @Column({ name: 'NAME', type: 'varchar2', length: 255 })
    name: string;

    @Column({ name: 'SORT_ORDER', type: 'number', nullable: true })
    sortOrder: number;
}
