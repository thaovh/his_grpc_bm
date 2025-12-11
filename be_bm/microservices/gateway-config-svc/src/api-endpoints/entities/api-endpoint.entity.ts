import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiEndpointRole } from './api-endpoint-role.entity';

@Entity('GW_API_ENDPOINTS')
export class ApiEndpoint extends BaseEntity {
    @Column({ type: 'varchar2', length: 500, name: 'PATH' })
    path: string;

    @Column({ type: 'varchar2', length: 10, name: 'METHOD' })
    method: string;

    @Column({ type: 'varchar2', length: 1000, name: 'DESCRIPTION', nullable: true })
    description: string;

    @Column({ type: 'varchar2', length: 100, name: 'MODULE', nullable: true })
    module: string;

    @Column({ type: 'number', precision: 1, scale: 0, name: 'IS_PUBLIC', default: 0 })
    isPublic: number;

    @Column({ type: 'number', precision: 10, scale: 0, name: 'RATE_LIMIT_REQUESTS', nullable: true })
    rateLimitRequests: number;

    @Column({ type: 'varchar2', length: 10, name: 'RATE_LIMIT_WINDOW', nullable: true })
    rateLimitWindow: string;

    @Column({ type: 'varchar2', length: 100, name: 'KONG_ROUTE_ID', nullable: true })
    kongRouteId: string;

    @Column({ type: 'varchar2', length: 200, name: 'KONG_ROUTE_NAME', nullable: true })
    kongRouteName: string;

    @Column({ type: 'varchar2', length: 200, name: 'RESOURCE_NAME', nullable: true })
    resourceName: string;

    @Column({ type: 'varchar2', length: 50, name: 'ACTION', nullable: true })
    action: string;

    @OneToMany(() => ApiEndpointRole, role => role.endpoint, { cascade: true })
    roles: ApiEndpointRole[];
}
