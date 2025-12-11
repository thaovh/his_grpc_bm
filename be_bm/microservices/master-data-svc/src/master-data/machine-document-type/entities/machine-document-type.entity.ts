import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MST_MACHINE_DOCUMENT_TYPE')
@Index('IDX_MST_MDOC_TYPE_SORT', ['sortOrder'])
export class MachineDocumentType extends BaseEntity {
    @Column({
        type: 'varchar2',
        length: 50,
        name: 'CODE',
        unique: true,
        nullable: false,
        comment: 'Mã loại tài liệu máy'
    })
    code: string;

    @Column({
        type: 'varchar2',
        length: 255,
        name: 'NAME',
        nullable: false,
        comment: 'Tên loại tài liệu máy'
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

    @Column({
        type: 'number',
        precision: 1,
        scale: 0,
        name: 'IS_REQUIRED',
        nullable: false,
        default: 0,
        comment: 'Bắt buộc nhập: 1 = Yes, 0 = No'
    })
    isRequired: number;
}
