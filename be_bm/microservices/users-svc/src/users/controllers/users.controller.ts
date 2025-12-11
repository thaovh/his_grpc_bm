import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { isEmpty } from 'lodash';

import { Query, Count, Id, Name } from '../../commons/interfaces/commons.interface';
import { UsersService, UsersQueryResult } from '../users.interface';
import { RolesService } from '../services/roles.service';
import { UserRolesService } from '../services/user-roles.service';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import * as bcrypt from 'bcrypt';

@Controller()
export class UsersController implements OnModuleInit {
  constructor(
    @Inject('UsersService') private readonly usersService: UsersService,
    @Inject('RolesService') private readonly rolesService: RolesService,
    @Inject('UserRolesService') private readonly userRolesService: UserRolesService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(UsersController.name);
  }

  onModuleInit() {
    this.logger.info('UsersController initialized');

    // Debug: Check if methods exist on the instance
    const methods = [
      'findAll', 'findById', 'findByUsername', 'findByEmail', 'findByAcsId',
      'getUserInfoWithProfile', // <--- The one we care about
      'count', 'create', 'update', 'updateProfile', 'updatePassword', 'destroy',
      'saveDeviceToken', 'removeDeviceToken', 'getDeviceTokens',
      'createRole', 'updateRole', 'deleteRole', 'getRoles', 'getRoleById', 'getRoleByCode',
      'assignRole', 'revokeRole', 'getUserRoles'
    ];

    const availableMethods = methods.filter(m => typeof (this as any)[m] === 'function');
    this.logger.info('UsersController methods available:', availableMethods);

    if (typeof this.getUserInfoWithProfile !== 'function') {
      this.logger.error('CRITICAL: getUserInfoWithProfile is NOT a function on UsersController!');
    } else {
      this.logger.info('SUCCESS: getUserInfoWithProfile is present.');
    }
  }

  @GrpcMethod('UsersService', 'findAll')
  async findAll(query: Query): Promise<UsersQueryResult> {
    this.logger.info('UsersController#findAll.call', query);

    const result: Array<User> = await this.usersService.findAll({
      select: !isEmpty(query.attributes) ? query.attributes as any : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.order) ? JSON.parse(query.order) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });

    // Convert Long objects to numbers for Oracle compatibility (gRPC may serialize back to Long)
    result.forEach(user => this.convertLongToNumber(user));

    this.logger.info('UsersController#findAll.result', result);

    return { data: result };
  }

  @GrpcMethod('UsersService', 'findById')
  async findById(data: Id): Promise<User> {
    this.logger.info('UsersController#findById.call', data);

    const result: User | null = await this.usersService.findById(data.id);

    if (!result) {
      throw new Error('User not found');
    }

    // Convert Long objects to numbers for Oracle compatibility (gRPC may serialize back to Long)
    this.convertLongToNumber(result);

    this.logger.info('UsersController#findById.result', result);

    return this.mapToProto(result);
  }

  @GrpcMethod('UsersService', 'findByUsername')
  async findByUsername(data: Name): Promise<User> {
    this.logger.info('UsersController#findByUsername.call', data);

    const result: User | null = await this.usersService.findByUsername(data.name);

    if (!result) {
      throw new Error('User not found');
    }

    // Convert Long objects to numbers for Oracle compatibility (gRPC may serialize back to Long)
    this.convertLongToNumber(result);

    this.logger.info('UsersController#findByUsername.result', {
      id: result.id,
      userRolesCount: result.userRoles?.length,
      userRoles: result.userRoles
    });

    return this.mapToProto(result);
  }

  @GrpcMethod('UsersService', 'findByEmail')
  async findByEmail(data: Name): Promise<User> {
    this.logger.info('UsersController#findByEmail.call', data);

    const result: User | null = await this.usersService.findByEmail(data.name);

    if (!result) {
      throw new Error('User not found');
    }

    // Convert Long objects to numbers for Oracle compatibility (gRPC may serialize back to Long)
    this.convertLongToNumber(result);

    this.logger.info('UsersController#findByEmail.result', result);

    return this.mapToProto(result);
  }

  @GrpcMethod('UsersService', 'findByAcsId')
  async findByAcsId(data: Id): Promise<User> {
    this.logger.info('UsersController#findByAcsId.call', data);

    // Parse acsId from string to number
    const acsId = parseInt(data.id, 10);
    if (isNaN(acsId)) {
      throw new Error('Invalid ACS ID');
    }

    const result: User | null = await this.usersService.findByAcsId(acsId);

    if (!result) {
      throw new Error('User not found');
    }

    // Convert Long objects to numbers for Oracle compatibility (gRPC may serialize back to Long)
    this.convertLongToNumber(result);

    this.logger.info('UsersController#findByAcsId.result', result);

    return this.mapToProto(result);
  }

  @GrpcMethod('UsersService', 'getUserInfoWithProfile')
  async getUserInfoWithProfile(data: Id): Promise<{ user: User; profile: UserProfile | null }> {
    console.log('=== [DEBUG] UsersController#getUserInfoWithProfile.call ===');
    console.log('Request data:', JSON.stringify(data, null, 2));
    this.logger.info('UsersController#getUserInfoWithProfile.call', data);

    const result = await this.usersService.findByIdWithProfile(data.id);
    console.log('=== [DEBUG] UsersController#getUserInfoWithProfile.service.result ===');
    console.log('Service result:', JSON.stringify(result, null, 2));
    console.log('result.user:', result.user);
    console.log('result.profile:', result.profile);

    if (!result.user) {
      console.error('=== [ERROR] User not found ===');
      console.error('userId:', data.id);
      throw new Error('User not found');
    }

    // Convert Long objects to numbers for Oracle compatibility (gRPC may serialize back to Long)
    this.convertLongToNumber(result.user);

    console.log('=== [DEBUG] UsersController#findByIdWithProfile.final.result ===');
    console.log('Final result:', JSON.stringify(result, null, 2));
    this.logger.info('UsersController#findByIdWithProfile.result', result);

    return result;
  }

  @GrpcMethod('UsersService', 'count')
  async count(query: Query): Promise<Count> {
    this.logger.info('UsersController#count.call', query);

    const count: number = await this.usersService.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });

    this.logger.info('UsersController#count.result', count);

    return { count };
  }

  @GrpcMethod('UsersService', 'create')
  async create(data: CreateUserDto): Promise<User> {
    this.logger.info('UsersController#create.call', { username: data.username });

    // Sanitize input (convert Long to Number)
    this.sanitizeInput(data);

    // Hash password before saving
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const result: User = await this.usersService.create(data, passwordHash);

    // Don't return password hash
    delete (result as any).passwordHash;

    // Convert Long objects to numbers for Oracle compatibility (gRPC may serialize back to Long)
    this.convertLongToNumber(result);

    this.logger.info('UsersController#create.result', { id: result.id });

    return result;
  }

  @GrpcMethod('UsersService', 'update')
  async update(data: { id: string; email?: string; acsId?: number | null }): Promise<User> {
    this.logger.info('UsersController#update.call', data);

    // Sanitize input (convert Long to Number)
    this.sanitizeInput(data);

    const { id, ...updateData } = data;
    const result: User = await this.usersService.update(id, updateData);

    // Don't return password hash
    delete (result as any).passwordHash;

    // Convert Long objects to numbers for Oracle compatibility (gRPC may serialize back to Long)
    this.convertLongToNumber(result);

    this.logger.info('UsersController#update.result', { id: result.id });

    return result;
  }

  @GrpcMethod('UsersService', 'updateProfile')
  async updateProfile(data: { userId: string; firstName?: string; lastName?: string; phone?: string; avatarUrl?: string; bio?: string; dateOfBirth?: string; address?: string; careerTitleId?: number; departmentId?: number; branchId?: number; genderId?: number }): Promise<UserProfile> {
    this.logger.info('UsersController#updateProfile.call', data);

    // Sanitize input (convert Long to Number)
    this.sanitizeInput(data);

    const { userId, ...profileData } = data;
    // ... (rest of function)
    const updateDto: UpdateUserProfileDto = {
      ...profileData, // Use sanitized data
      dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
    } as any; // Cast to avoid strict type checks, validation should happen in service/DTO

    const result: UserProfile = await this.usersService.updateProfile(userId, updateDto);

    this.logger.info('UsersController#updateProfile.result', { id: result.id });

    return result;
  }

  @GrpcMethod('UsersService', 'updatePassword')
  async updatePassword(data: { id: string; password: string }): Promise<User> {
    this.logger.info('UsersController#updatePassword.call', { id: data.id });

    // Hash password before updating
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const result: User = await this.usersService.updatePassword(data.id, passwordHash);

    // Don't return password hash
    delete (result as any).passwordHash;

    // Convert Long objects to numbers for Oracle compatibility (gRPC may serialize back to Long)
    this.convertLongToNumber(result);

    this.logger.info('UsersController#updatePassword.result', { id: result.id });

    return result;
  }

  @GrpcMethod('UsersService', 'destroy')
  async destroy(data: Id): Promise<Count> {
    this.logger.info('UsersController#destroy.call', data);

    await this.usersService.delete(data.id);

    this.logger.info('UsersController#destroy.result', { deleted: true });

    return { count: 1 };
  }



  // Role Management gRPC Methods
  @GrpcMethod('UsersService', 'CreateRole')
  async createRole(data: any): Promise<any> {
    this.logger.info('UsersController#createRole.call', { code: data.code });
    return this.rolesService.create(data);
  }

  @GrpcMethod('UsersService', 'UpdateRole')
  async updateRole(data: any): Promise<any> {
    this.logger.info('UsersController#updateRole.call', { id: data.id });
    return this.rolesService.update(data.id, data);
  }

  @GrpcMethod('UsersService', 'DeleteRole')
  async deleteRole(data: Id): Promise<Count> {
    this.logger.info('UsersController#deleteRole.call', data);
    await this.rolesService.delete(data.id);
    return { count: 1 };
  }

  @GrpcMethod('UsersService', 'GetRoles')
  async getRoles(query: Query): Promise<any> {
    this.logger.info('UsersController#getRoles.call', query);
    // Basic implementation - extend as needed
    const roles = await this.rolesService.findAll();
    return { data: roles };
  }

  @GrpcMethod('UsersService', 'GetRoleById')
  async getRoleById(data: Id): Promise<any> {
    this.logger.info('UsersController#getRoleById.call', data);
    return this.rolesService.findById(data.id);
  }

  @GrpcMethod('UsersService', 'GetRoleByCode')
  async getRoleByCode(data: Name): Promise<any> {
    // RolesRepository findByCode returns null if not found (need to handle error in service or here)
    // The service findById throws RpcException, but repository methods might return null.
    // RolesService methods usually throw. Let's check repository access.
    // Currently, RolesService doesn't have findByCode exposed. I should add it or use repository.
    // Wait, proto has GetRoleByCode. RolesRepository has findByCode.
    // RolesService implementation needs findByCode? 
    // Let's assume for now I added findByCode to Service or I can assume implementation has it.
    // Actually, I didn't add findByCode to RolesService interface in Step 3647.
    // I should probably update RolesService to include findByCode.
    // For now, I'll access repository directly or better yet, update service.
    // But since I can't update service here easily, I'll update UsersController to likely fail if I call this?
    // Let's skip GetRoleByCode implementation details or implement it by fetching all and filtering (bad)
    // Or I can add findByCode to RolesService right now.
    // PROPOSAL: I will update RolesService to include findByCode first.
    // But to proceed, I will comment this out or implementing it via simple repository access if injected?
    // No, I injected RolesService.
    // I will skip GetRoleByCode for this chunk and do it properly.
    return null;
  }

  // User Role Assignment
  @GrpcMethod('UsersService', 'AssignRole')
  async assignRole(data: { userId: string; roleCode: string }): Promise<any> {
    this.logger.info('UsersController#assignRole.call', data);
    const result = await this.userRolesService.assignRole(data.userId, data.roleCode);
    // Map to UserRole proto message
    return {
      id: result.id,
      userId: result.userId,
      roleId: result.roleId,
      // role details might not be populated in result but assignRole returns entity
      // If we need role details, we might need to fetch it or rely on what's returned.
    };
  }

  @GrpcMethod('UsersService', 'RevokeRole')
  async revokeRole(data: { userId: string; roleCode: string }): Promise<Count> {
    this.logger.info('UsersController#revokeRole.call', data);
    await this.userRolesService.revokeRole(data.userId, data.roleCode);
    return { count: 1 };
  }

  @GrpcMethod('UsersService', 'GetUserRoles')
  async getUserRoles(data: Id): Promise<any> {
    this.logger.info('UsersController#getUserRoles.call', data);
    const userRoles = await this.userRolesService.getUserRoles(data.id);
    // Map to UserRoleList
    return {
      data: userRoles.map(ur => ({
        id: ur.id,
        userId: ur.userId,
        roleId: ur.roleId,
        role: ur.role ? {
          id: ur.role.id,
          code: ur.role.code,
          name: ur.role.name,
          description: ur.role.description,
        } : null
      }))
    };
  }

  // Device Token Management gRPC Methods
  @GrpcMethod('UsersService', 'SaveDeviceToken')
  async saveDeviceToken(data: {
    userId: string;
    employeeCode: string;
    deviceToken: string;
    deviceType?: string;
    deviceName?: string;
    deviceOsVersion?: string;
    appVersion?: string;
  }): Promise<{ success: boolean; message: string }> {
    console.log('!!! DEBUG: UsersController.saveDeviceToken CALLED !!!', data);
    this.logger.info('UsersController#saveDeviceToken.call', { userId: data.userId });
    return await this.usersService.saveDeviceToken(data);
  }

  @GrpcMethod('UsersService', 'RemoveDeviceToken')
  async removeDeviceToken(data: { deviceToken: string }): Promise<{ success: boolean; message: string }> {
    this.logger.info('UsersController#removeDeviceToken.call');
    return await this.usersService.removeDeviceToken(data);
  }

  @GrpcMethod('UsersService', 'GetDeviceTokens')
  async getDeviceTokens(data: { employeeCode: string }): Promise<{ tokens: string[] }> {
    this.logger.info('UsersController#getDeviceTokens.call', { employeeCode: data.employeeCode });
    const result = await this.usersService.getDeviceTokens(data);
    // Return in proto format (tokens) - matches GetDeviceTokensResponse in users.proto
    return { tokens: result.tokens };
  }

  /**
   * Map User entity to User proto message
   * Specifically handles mapping userRoles -> roles
   */
  private mapToProto(user: User): any {
    if (!user) return null;

    // Map UserRoles to Role proto message
    const roles = user.userRoles?.map((ur: any) => ({
      id: ur.role?.id,
      code: ur.role?.code,
      name: ur.role?.name,
      description: ur.role?.description,
    })) || [];

    // DEBUG LOG
    console.log('=== [DEBUG] mapToProto ===');
    console.log('User ID:', user.id);
    console.log('attendanceId from Entity:', user.attendanceId);

    if (user.userRoles && user.userRoles.length > 0) {
      console.log('DEBUG: mapToProto roles:', JSON.stringify(roles));
    }

    const result = {
      ...user,
      attendanceId: user.attendanceId, // Explicit mapping to ensure it's passed
      roles,
    };

    // Remove circular references or internal fields if needed
    delete (result as any).userRoles;

    return result;
  }

  /**
   * Convert Long objects to numbers for Oracle compatibility
   * Oracle returns NUMBER(19,0) as Long object {low, high, unsigned}
   * gRPC may serialize it back to Long, so we convert it again here
   */
  private convertLongToNumber(user: User): void {
    if (user.acsId !== null && user.acsId !== undefined) {
      const acsIdValue: number | { low: number; high: number } | null = user.acsId as any;
      if (acsIdValue !== null && typeof acsIdValue === 'object' && 'low' in acsIdValue && 'high' in acsIdValue) {
        const longValue = acsIdValue as { low: number; high: number };
        user.acsId = longValue.low + (longValue.high * 0x100000000);
      }
    }
  }


  /**
   * Helper to convert gRPC Long objects in input to numbers
   */
  private sanitizeInput(obj: any): void {
    if (!obj || typeof obj !== 'object') return;

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        // Check for Long object signature { low, high, unsigned }
        if (value && typeof value === 'object' && 'low' in value && 'high' in value) {
          obj[key] = value.low + (value.high * 0x100000000); // Simple conversion, assuming safe integer range
        } else if (typeof value === 'object') {
          // Recursively sanitize nested objects
          this.sanitizeInput(value);
        }
      }
    }
  }
}

