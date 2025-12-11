import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class UserRolesRepository {
    constructor(
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(UserRolesRepository.name);
    }

    async findAll(options?: FindManyOptions<UserRole>): Promise<UserRole[]> {
        this.logger.info('UserRolesRepository#findAll.call', options);
        const result = await this.userRoleRepository.find(options);
        this.logger.info('UserRolesRepository#findAll.result', { count: result.length });
        return result;
    }

    async findByUserId(userId: string): Promise<UserRole[]> {
        this.logger.info('UserRolesRepository#findByUserId.call', { userId });
        const result = await this.userRoleRepository.find({
            where: { userId },
            relations: ['role'], // Eager load role details
        });
        this.logger.info('UserRolesRepository#findByUserId.result', { count: result.length });
        return result;
    }

    async assignRole(userId: string, roleId: string): Promise<UserRole> {
        this.logger.info('UserRolesRepository#assignRole.call', { userId, roleId });

        // Check if already assigned
        const existing = await this.userRoleRepository.findOne({
            where: { userId, roleId }
        });

        if (existing) {
            this.logger.info('UserRolesRepository#assignRole.alreadyExists', { id: existing.id });
            return existing;
        }

        const { randomUUID } = require('crypto');
        const now = new Date();

        const entityData: any = {
            id: randomUUID(),
            userId, // Keep for returned object
            roleId, // Keep for returned object
            user: { id: userId }, // Explicit relation for FK
            role: { id: roleId }, // Explicit relation for FK
            isActive: 1, // Default active
            version: 1,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            createdBy: null,
            updatedBy: null,
        };

        const entity = this.userRoleRepository.create(entityData);
        const saved = await this.userRoleRepository.save(entity);
        const result = Array.isArray(saved) ? saved[0] : saved;
        this.logger.info('UserRolesRepository#assignRole.result', { id: result.id });
        return result;
    }

    async revokeRole(userId: string, roleId: string): Promise<void> {
        this.logger.info('UserRolesRepository#revokeRole.call', { userId, roleId });
        await this.userRoleRepository.delete({ userId, roleId });
        this.logger.info('UserRolesRepository#revokeRole.result', { revoked: true });
    }

    async revokeAllUserRoles(userId: string): Promise<void> {
        this.logger.info('UserRolesRepository#revokeAllUserRoles.call', { userId });
        await this.userRoleRepository.delete({ userId });
        this.logger.info('UserRolesRepository#revokeAllUserRoles.result', { revoked: true });
    }
}
