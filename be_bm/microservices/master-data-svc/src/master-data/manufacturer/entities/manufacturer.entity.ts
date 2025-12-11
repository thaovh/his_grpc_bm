import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MAC_MANUFACTURER')
export class Manufacturer extends BaseEntity {
    @Column({ type: 'varchar2', length: 50, name: 'CODE', unique: true })
    code: string;

    @Column({ type: 'varchar2', length: 255, name: 'NAME' })
    name: string;
}
