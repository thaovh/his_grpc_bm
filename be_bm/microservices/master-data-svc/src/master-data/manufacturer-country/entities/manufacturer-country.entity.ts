import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MST_MANUFACTURER_COUNTRY')
@Index('IDX_MST_MCOUNTRY_SORT', ['sortOrder'])
export class ManufacturerCountry extends BaseEntity {
    @Column({
        type: 'varchar2',
        length: 50,
        name: 'CODE',
        unique: true,
        nullable: false,
        comment: 'Mã nước sản xuất'
    })
    code: string;

    @Column({
        type: 'varchar2',
        length: 255,
        name: 'NAME',
        nullable: false,
        comment: 'Tên nước sản xuất'
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
