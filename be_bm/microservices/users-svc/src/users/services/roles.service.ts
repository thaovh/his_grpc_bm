import { Injectable, Logger } from '@nestjs/common';
import { RolesRepository } from '../repositories/roles.repository';
import { Role } from '../entities/role.entity';
import { RpcException } from '@nestjs/microservices';

export interface RolesService {
    findAll(): Promise<Role[]>;
    findById(id: string): Promise<Role>;
    findByCode(code: string): Promise<Role>;
    create(data: Partial<Role>): Promise<Role>;
    update(id: string, data: Partial<Role>): Promise<Role>;
    delete(id: string): Promise<void>;
}

@Injectable()
export class RolesServiceImpl implements RolesService {
    private readonly logger = new Logger(RolesServiceImpl.name);

    constructor(private readonly rolesRepository: RolesRepository) { }

    async findAll(): Promise<Role[]> {
        return this.rolesRepository.findAll();
    }

    async findById(id: string): Promise<Role> {
        const role = await this.rolesRepository.findById(id);
        if (!role) {
            throw new RpcException({
                code: 5, // NOT_FOUND
                message: 'Role not found',
            });
        }
        return role;
    }

    async findByCode(code: string): Promise<Role> {
        const role = await this.rolesRepository.findByCode(code);
        if (!role) {
            throw new RpcException({
                code: 5, // NOT_FOUND
                message: `Role with code ${code} not found`,
            });
        }
        return role;
    }

    async create(data: Partial<Role>): Promise<Role> {
        if (!data.code || !data.name) {
            throw new RpcException({
                code: 3, // INVALID_ARGUMENT
                message: 'Role code and name are required',
            });
        }

        // Check duplicate code
        const existing = await this.rolesRepository.findByCode(data.code);
        if (existing) {
            throw new RpcException({
                code: 6, // ALREADY_EXISTS
                message: `Role with code ${data.code} already exists`,
            });
        }

        return this.rolesRepository.create(data);
    }

    async update(id: string, data: Partial<Role>): Promise<Role> {
        const role = await this.rolesRepository.findById(id);
        if (!role) {
            throw new RpcException({
                code: 5, // NOT_FOUND
                message: 'Role not found',
            });
        }

        if (data.code && data.code !== role.code) {
            // Check duplicate code if changing code
            const existing = await this.rolesRepository.findByCode(data.code);
            if (existing) {
                throw new RpcException({
                    code: 6, // ALREADY_EXISTS
                    message: `Role with code ${data.code} already exists`,
                });
            }
        }

        return this.rolesRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        const role = await this.rolesRepository.findById(id);
        if (!role) {
            throw new RpcException({
                code: 5, // NOT_FOUND
                message: 'Role not found',
            });
        }
        await this.rolesRepository.delete(id);
    }
}
