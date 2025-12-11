import { PrimaryColumn, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryColumn({ type: 'varchar2', length: 36, name: 'ID' })
    id: string;

    @CreateDateColumn({ type: 'timestamp', name: 'CREATED_AT' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'UPDATED_AT' })
    updatedAt: Date;

    @VersionColumn({ type: 'number', name: 'VERSION', default: 1 })
    version: number;
}
