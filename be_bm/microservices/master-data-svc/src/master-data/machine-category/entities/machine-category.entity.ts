import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MST_MACHINE_CATEGORY')
@Index('IDX_MST_MACH_CAT_SORT', ['sortOrder'])
export class MachineCategory extends BaseEntity {
    @Column({
        type: 'varchar2',
        length: 50,
        name: 'CODE',
        unique: true,
        nullable: false,
        comment: 'Mã loại máy'
    })
    code: string;

    @Column({
        type: 'varchar2',
        length: 255,
        name: 'NAME',
        nullable: false,
        comment: 'Tên loại máy'
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
