import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { Branch } from '../../branch/entities/branch.entity';
import { DepartmentType } from '../../department-type/entities/department-type.entity';

@Entity('MST_DEPARTMENT')
export class Department extends BaseEntity {
    @Column({
        type: 'varchar2',
        length: 50,
        name: 'CODE',
        unique: true,
        nullable: false,
        comment: 'Mã khoa phòng'
    })
    code: string;

    @Column({
        type: 'varchar2',
        length: 255,
        name: 'NAME',
        nullable: false,
        comment: 'Tên khoa phòng'
    })
    name: string;

    @Column({
        type: 'varchar2',
        length: 36,
        name: 'PARENT_ID',
        nullable: true,
        comment: 'ID khoa cha'
    })
    parentId: string;

    @Column({
        type: 'varchar2',
        length: 36,
        name: 'BRANCH_ID',
        nullable: false,
        comment: 'ID chi nhánh'
    })
    branchId: string;

    @Column({
        type: 'varchar2',
        length: 36,
        name: 'DEPARTMENT_TYPE_ID',
        nullable: false,
        comment: 'ID loại khoa'
    })
    departmentTypeId: string;

    @Column({
        type: 'number',
        precision: 19,
        scale: 0,
        name: 'HIS_ID',
        nullable: true,
        comment: 'ID khoa phòng trên HIS'
    })
    hisId: number;

    @Column({
        type: 'number',
        precision: 1,
        scale: 0,
        name: 'IS_ASSET_MANAGEMENT',
        nullable: false,
        default: 0,
        comment: 'Là khoa quản lý tài sản'
    })
    isAssetManagement: number;

    @ManyToOne(() => Department, (department) => department.children)
    @JoinColumn({ name: 'PARENT_ID' })
    parent: Department;

    @OneToMany(() => Department, (department) => department.parent)
    children: Department[];

    @ManyToOne(() => Branch)
    @JoinColumn({ name: 'BRANCH_ID' })
    branch: Branch;

    @ManyToOne(() => DepartmentType)
    @JoinColumn({ name: 'DEPARTMENT_TYPE_ID' })
    departmentType: DepartmentType;
}
