import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';
import { User } from './user.entity';

/**
 * DeviceToken Entity - Store FCM device tokens for push notifications
 * Table: USR_DEVICE_TOKENS
 * Service Prefix: USR
 */
@Entity('USR_DEVICE_TOKENS')
export class DeviceToken extends BaseEntity {
    @Column({ type: 'varchar2', length: 36, name: 'USER_ID' })
    userId: string;

    @Column({ type: 'varchar2', length: 50, name: 'EMPLOYEE_CODE', nullable: true })
    employeeCode: string;

    @Column({ type: 'varchar2', length: 500, name: 'DEVICE_TOKEN', unique: true })
    deviceToken: string;

    @Column({ type: 'varchar2', length: 20, name: 'DEVICE_TYPE', nullable: true })
    deviceType: string; // 'ios', 'android', 'web'

    @Column({ type: 'varchar2', length: 100, name: 'DEVICE_NAME', nullable: true })
    deviceName: string;

    @Column({ type: 'varchar2', length: 50, name: 'DEVICE_OS_VERSION', nullable: true })
    deviceOsVersion: string;

    @Column({ type: 'varchar2', length: 20, name: 'APP_VERSION', nullable: true })
    appVersion: string;

    @Column({ type: 'timestamp', name: 'LAST_USED_AT', nullable: true })
    lastUsedAt: Date;

    @Column({ type: 'number', precision: 1, scale: 0, name: 'IS_ACTIVE', default: 1 })
    isActive: number;

    // Relationship
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'USER_ID' })
    user: User;
}
