import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MST_BRANCH')
export class Branch extends BaseEntity {
    @Column({
        type: 'varchar2',
        length: 50,
        name: 'CODE',
        unique: true,
        nullable: false,
        comment: 'Mã chi nhánh'
    })
    code: string;

    @Column({
        type: 'varchar2',
        length: 255,
        name: 'NAME',
        nullable: false,
        comment: 'Tên chi nhánh'
    })
    name: string;

    @Column({
        type: 'varchar2',
        length: 500,
        name: 'ADDRESS',
        nullable: true,
        comment: 'Địa chỉ'
    })
    address: string;
}
