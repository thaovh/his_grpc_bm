import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MST_VENDOR')
export class Vendor extends BaseEntity {
    @Column({ name: 'CODE', type: 'varchar2', length: 50, unique: true })
    code: string;

    @Column({ name: 'NAME', type: 'varchar2', length: 255 })
    name: string;

    @Column({ name: 'ADDRESS', type: 'varchar2', length: 500, nullable: true })
    address: string;

    @Column({ name: 'PHONE', type: 'varchar2', length: 50, nullable: true })
    phone: string;

    @Column({ name: 'EMAIL', type: 'varchar2', length: 100, nullable: true })
    email: string;
}
