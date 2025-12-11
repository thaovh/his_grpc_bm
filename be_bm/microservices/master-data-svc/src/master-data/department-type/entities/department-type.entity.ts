import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('MST_DEPARTMENT_TYPE')
export class DepartmentType extends BaseEntity {
    @Column({
        type: 'varchar2',
        length: 50,
        name: 'CODE',
        unique: true,
        nullable: false,
        comment: 'Mã loại khoa'
    })
    code: string;

    @Column({
        type: 'varchar2',
        length: 255,
        name: 'NAME',
        nullable: false,
        comment: 'Tên loại khoa'
    })
    name: string;
}
