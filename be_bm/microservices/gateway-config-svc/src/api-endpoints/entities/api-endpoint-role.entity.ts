import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiEndpoint } from './api-endpoint.entity';

@Entity('GW_API_ENDPOINT_ROLES')
export class ApiEndpointRole extends BaseEntity {
    @Column({ type: 'varchar2', length: 36, name: 'ENDPOINT_ID' })
    endpointId: string;

    @Column({ type: 'varchar2', length: 50, name: 'ROLE_CODE' })
    roleCode: string;

    @ManyToOne(() => ApiEndpoint, endpoint => endpoint.roles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ENDPOINT_ID' })
    endpoint: ApiEndpoint;
}
