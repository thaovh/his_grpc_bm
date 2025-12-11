import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MAC_MACHINE_DOCUMENT')
export class MachineDocument extends BaseEntity {
    @Column({ type: 'varchar2', length: 36, name: 'MACHINE_ID' })
    machineId: string;

    @Column({ type: 'varchar2', length: 50, name: 'TYPE' })
    type: string;

    @Column({ type: 'varchar2', length: 255, name: 'FILE_NAME' })
    fileName: string;

    @Column({ type: 'varchar2', length: 1000, name: 'FILE_URL' })
    fileUrl: string;

    @Column({ type: 'varchar2', length: 1000, name: 'DESCRIPTION', nullable: true })
    description: string;
}
