import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { AppFeature } from './app-feature.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('APP_FEATURE_ROLES')
export class AppFeatureRole extends BaseEntity {
    @Column({ name: 'APP_FEATURE_ID' })
    appFeatureId: string;

    @Column({ name: 'ROLE_CODE' })
    roleCode: string;

    @ManyToOne(() => AppFeature, (feature) => feature.roles)
    @JoinColumn({ name: 'APP_FEATURE_ID' })
    appFeature: AppFeature;

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.version = 1;
        this.isActive = 1;
    }
}
