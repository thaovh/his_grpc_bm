import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MST_MACHINE_FUNDING_SOURCE')
@Index('IDX_MST_MFS_SORT', ['sortOrder'])
export class MachineFundingSource extends BaseEntity {
    @Column({
        type: 'varchar2',
        length: 50,
        name: 'CODE',
        unique: true,
        nullable: false,
        comment: 'Mã nguồn kinh phí máy'
    })
    code: string;

    @Column({
        type: 'varchar2',
        length: 255,
        name: 'NAME',
        nullable: false,
        comment: 'Tên nguồn kinh phí máy'
    })
    name: string;

    @Column({
        type: 'number',
        precision: 10,
        scale: 0,
        name: 'SORT_ORDER',
        nullable: false,
        default: 0,
        comment: 'Thứ tự sắp xếp'
    })
    sortOrder: number;
}
