import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesRepository {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(RolesRepository.name);
    }

    async findAll(options?: FindManyOptions<Role>): Promise<Role[]> {
        this.logger.info('RolesRepository#findAll.call', options);
        const result = await this.roleRepository.find(options);
        this.logger.info('RolesRepository#findAll.result', { count: result.length });
        return result;
    }

    async findOne(options?: FindOneOptions<Role>): Promise<Role | null> {
        this.logger.info('RolesRepository#findOne.call', options);
        const result = await this.roleRepository.findOne(options);
        this.logger.info('RolesRepository#findOne.result', { found: !!result });
        return result;
    }

    async findById(id: string): Promise<Role | null> {
        this.logger.info('RolesRepository#findById.call', { id });
        const result = await this.roleRepository.findOne({ where: { id } });
        this.logger.info('RolesRepository#findById.result', { found: !!result });
        return result;
    }

    async findByCode(code: string): Promise<Role | null> {
        this.logger.info('RolesRepository#findByCode.call', { code });
        const result = await this.roleRepository.findOne({ where: { code } });
        this.logger.info('RolesRepository#findByCode.result', { found: !!result });
        return result;
    }

    async create(data: Partial<Role>): Promise<Role> {
        this.logger.info('RolesRepository#create.call', { code: data.code });
        const { randomUUID } = require('crypto');
        const now = new Date();

        // Explicitly set fields to avoid Oracle RETURNING issue
        const entityData = {
            id: randomUUID(),
            code: data.code,
            name: data.name,
            description: data.description || null,
            isActive: data.isActive !== undefined ? data.isActive : 1,
            version: 1,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            createdBy: null,
            updatedBy: null,
        };

        const entity = this.roleRepository.create(entityData);
        const result = await this.roleRepository.save(entity);
        this.logger.info('RolesRepository#create.result', { id: result.id });
        return result;
    }

    async update(id: string, data: Partial<Role>): Promise<Role> {
        this.logger.info('RolesRepository#update.call', { id, data });
        await this.roleRepository.update(id, data);
        const result = await this.findById(id);
        if (!result) {
            throw new Error('Role not found after update');
        }
        this.logger.info('RolesRepository#update.result', { id: result.id });
        return result;
    }

    async delete(id: string): Promise<void> {
        this.logger.info('RolesRepository#delete.call', { id });
        await this.roleRepository.delete(id);
        this.logger.info('RolesRepository#delete.result', { deleted: true });
    }
}
