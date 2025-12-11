import { Injectable, Logger } from '@nestjs/common';
import { UserRolesRepository } from '../repositories/user-roles.repository';
import { UserRole } from '../entities/user-role.entity';
import { RolesRepository } from '../repositories/roles.repository';
import { UsersRepository } from '../repositories/users.repository';
import { RpcException } from '@nestjs/microservices';

export interface UserRolesService {
    assignRole(userId: string, roleCode: string): Promise<UserRole>;
    revokeRole(userId: string, roleCode: string): Promise<void>;
    getUserRoles(userId: string): Promise<UserRole[]>;
}

@Injectable()
export class UserRolesServiceImpl implements UserRolesService {
    private readonly logger = new Logger(UserRolesServiceImpl.name);

    constructor(
        private readonly userRolesRepository: UserRolesRepository,
        private readonly rolesRepository: RolesRepository,
        private readonly usersRepository: UsersRepository,
    ) { }

    async assignRole(userId: string, roleCode: string): Promise<UserRole> {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new RpcException({
                code: 5, // NOT_FOUND
                message: 'User not found',
            });
        }

        const role = await this.rolesRepository.findByCode(roleCode);
        if (!role) {
            throw new RpcException({
                code: 5, // NOT_FOUND
                message: `Role with code ${roleCode} not found`,
            });
        }

        return this.userRolesRepository.assignRole(userId, role.id);
    }

    async revokeRole(userId: string, roleCode: string): Promise<void> {
        const role = await this.rolesRepository.findByCode(roleCode);
        if (!role) {
            throw new RpcException({
                code: 5, // NOT_FOUND
                message: `Role with code ${roleCode} not found`,
            });
        }

        await this.userRolesRepository.revokeRole(userId, role.id);
    }

    async getUserRoles(userId: string): Promise<UserRole[]> {
        return this.userRolesRepository.findByUserId(userId);
    }
}
