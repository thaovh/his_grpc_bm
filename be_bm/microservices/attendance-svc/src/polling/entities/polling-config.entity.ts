import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';

@Entity('ATT_POLLING_CONFIG') // Proposed Table Name
export class PollingConfig extends BaseEntity {
    @Column({ type: 'varchar2', length: 100, name: 'NAME' })
    name: string;

    @Column({ type: 'varchar2', length: 50, name: 'IP_ADDRESS' })
    ipAddress: string;

    @Column({ type: 'number', name: 'PORT', default: 80 })
    port: number;

    @Column({ type: 'varchar2', length: 100, name: 'USERNAME' })
    username: string;

    @Column({ type: 'varchar2', length: 100, name: 'PASSWORD' })
    password: string;

    @Column({ type: 'number', name: 'POLL_INTERVAL', default: 60 })
    pollInterval: number;

    @Column({ type: 'timestamp with time zone', name: 'LAST_POLL_TIME', nullable: true })
    lastPollTime: Date;

    @Column({ type: 'number', name: 'IS_ACTIVE', default: 1 })
    isActive: number;
}
