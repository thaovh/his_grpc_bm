import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

/**
 * Notification Type Entity
 * Table: MST_NOTIFICATION_TYPE
 * Prefix: MST
 */
@Entity('MST_NOTIFICATION_TYPE')
@Index('IDX_MST_NOTIF_TYPE_SORT', ['sortOrder'])
export class NotificationType extends BaseEntity {
    @Column({
        type: 'varchar2',
        length: 50,
        name: 'CODE',
        unique: true,
        nullable: false,
        comment: 'Mã loại thông báo'
    })
    code: string;

    @Column({
        type: 'varchar2',
        length: 255,
        name: 'NAME',
        nullable: false,
        comment: 'Tên loại thông báo'
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
        type: 'varchar2',
        length: 2000,
        name: 'DESCRIPTION',
        nullable: true,
        comment: 'Mô tả'
    })
    description: string;
}
