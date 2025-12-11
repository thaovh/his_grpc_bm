import { Entity, Column, OneToMany, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { AppFeatureRole } from './app-feature-role.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('APP_FEATURES')
export class AppFeature extends BaseEntity {
    @Column({ name: 'CODE', unique: true })
    code: string;

    @Column({ name: 'NAME' })
    name: string;

    @Column({ name: 'ICON', nullable: true })
    icon: string;

    @Column({ name: 'ROUTE', nullable: true })
    route: string;

    @Column({ name: 'PARENT_ID', nullable: true })
    parentId: string;

    @Column({ name: 'ORDER_INDEX', default: 0 })
    orderIndex: number;

    @Column({ name: 'IS_ACTIVE', default: 1 })
    isActive: number;

    @ManyToOne(() => AppFeature, (feature) => feature.children)
    @JoinColumn({ name: 'PARENT_ID' })
    parent: AppFeature;

    @OneToMany(() => AppFeature, (feature) => feature.parent)
    children: AppFeature[];

    @OneToMany(() => AppFeatureRole, (role) => role.appFeature)
    roles: AppFeatureRole[];

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.version = 1;
        this.isActive = 1;
    }
}
