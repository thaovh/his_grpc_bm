import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';
import { User } from './user.entity';
import { Role } from './role.entity';

/**
 * UserRole Entity - Bảng trung gian gán Role cho User
 * Table: USR_USER_ROLES
 * Service Prefix: USR
 */
@Entity('USR_USER_ROLES')
@Index('IDX_UUR_USER_ID', ['userId'])
@Index('IDX_UUR_ROLE_ID', ['roleId'])
export class UserRole extends BaseEntity {
    @Column({
        type: 'varchar2',
        length: 36,
        name: 'USER_ID',
        nullable: false,
        comment: 'User ID'
    })
    userId: string;

    @Column({
        type: 'varchar2',
        length: 36,
        name: 'ROLE_ID',
        nullable: false,
        comment: 'Role ID'
    })
    roleId: string;

    @ManyToOne(() => User, user => user.userRoles)
    @JoinColumn({ name: 'USER_ID', referencedColumnName: 'id' })
    user: User;

    @ManyToOne(() => Role, role => role.userRoles)
    @JoinColumn({ name: 'ROLE_ID', referencedColumnName: 'id' })
    role: Role;
}
