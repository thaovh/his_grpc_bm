import {
    Column,
} from 'typeorm';

export abstract class BaseEntity {
    @Column({
        type: 'varchar2',
        length: 36,
        name: 'ID',
        primary: true,
    })
    id: string;

    @Column({
        type: 'timestamp',
        precision: 6,
        name: 'CREATED_AT',
        nullable: false,
    })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        precision: 6,
        name: 'UPDATED_AT',
        nullable: false,
    })
    updatedAt: Date;

    @Column({
        type: 'timestamp',
        precision: 6,
        name: 'DELETED_AT',
        nullable: true,
    })
    deletedAt: Date | null;

    @Column({
        type: 'number',
        precision: 10,
        scale: 0,
        name: 'VERSION',
        nullable: false
    })
    version: number;

    @Column({
        type: 'varchar2',
        length: 36,
        name: 'CREATED_BY',
        nullable: true,
    })
    createdBy: string | null;

    @Column({
        type: 'varchar2',
        length: 36,
        name: 'UPDATED_BY',
        nullable: true,
    })
    updatedBy: string | null;

    @Column({
        type: 'number',
        precision: 1,
        scale: 0,
        name: 'IS_ACTIVE',
    })
    isActive: number;
}
