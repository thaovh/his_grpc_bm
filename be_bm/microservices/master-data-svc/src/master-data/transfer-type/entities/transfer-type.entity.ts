import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MST_TRANSFER_TYPE')
export class TransferType extends BaseEntity {
    @Column({ type: 'varchar2', length: 50, name: 'CODE', unique: true })
    code: string;

    @Column({ type: 'nvarchar2', length: 255, name: 'NAME' })
    name: string;

    @Column({ type: 'number', precision: 10, scale: 0, name: 'SORT_ORDER', nullable: true })
    sortOrder: number;
}
