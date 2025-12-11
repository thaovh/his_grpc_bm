import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';
import { UserRole } from './user-role.entity';

/**
 * Role Entity - Định nghĩa các vai trò trong hệ thống
 * Table: USR_ROLES
 * Service Prefix: USR
 */
@Entity('USR_ROLES')
export class Role extends BaseEntity {
    @Column({
        type: 'varchar2',
        length: 50,
        name: 'CODE',
        unique: true,
        nullable: false,
        comment: 'Role Code (e.g. ADMIN, USER, DOCTOR)'
    })
    code: string;

    @Column({
        type: 'varchar2',
        length: 255,
        name: 'NAME',
        nullable: false,
        comment: 'Role Name (Display)'
    })
    name: string;

    @Column({
        type: 'varchar2',
        length: 1000,
        name: 'DESCRIPTION',
        nullable: true,
        comment: 'Description'
    })
    description: string | null;

    @OneToMany(() => UserRole, userRole => userRole.role)
    userRoles: UserRole[];
}
