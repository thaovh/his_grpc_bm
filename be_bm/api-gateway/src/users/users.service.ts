import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';

interface UsersGrpcService {
  findAll(data: any): any;
  findById(data: { id: string }): any;
  findByUsername(data: { name: string }): any;
  findByEmail(data: { name: string }): any;
  findByAcsId(data: { id: string }): any;
  getUserInfoWithProfile(data: { id: string }): any;
  count(data: any): any;
  create(data: any): any;
  update(data: any): any;
  updateProfile(data: any): any;
  destroy(data: { id: string }): any;
  // Role Management
  CreateRole(data: any): any;
  UpdateRole(data: any): any;
  DeleteRole(data: { id: string }): any;
  GetRoles(data: any): any;
  GetRoleById(data: { id: string }): any;
  GetRoleByCode(data: { name: string }): any;
  // User Role Assignment
  AssignRole(data: { userId: string; roleCode: string }): any;
  RevokeRole(data: { userId: string; roleCode: string }): any;
  GetUserRoles(data: { id: string }): any;
  // Device Token Management
  SaveDeviceToken(data: any): any;
  RemoveDeviceToken(data: { deviceToken: string }): any;
  GetDeviceTokens(data: { employeeCode: string }): any;
}

@Injectable()
export class UsersService implements OnModuleInit {
  private usersGrpcService: UsersGrpcService;

  constructor(
    @Inject('USERS_PACKAGE') private readonly client: ClientGrpc,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  onModuleInit() {
    this.usersGrpcService = this.client.getService<UsersGrpcService>('UsersService');
  }

  async findAll(query?: any) {
    this.logger.info('UsersService#findAll.call', query);
    const result = await firstValueFrom(this.usersGrpcService.findAll(query || {})) as any;
    this.logger.info('UsersService#findAll.result', result);
    const users = result.data || [];
    // Convert Long objects to numbers for Oracle compatibility
    users.forEach((user: any) => this.convertLongToNumber(user));
    return users;
  }

  async findById(id: string) {
    this.logger.info('UsersService#findById.call', { id });
    const result = await firstValueFrom(this.usersGrpcService.findById({ id })) as any;
    this.logger.info('UsersService#findById.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    return result;
  }

  async findByUsername(username: string) {
    this.logger.info('UsersService#findByUsername.call', { username });
    const result = await firstValueFrom(this.usersGrpcService.findByUsername({ name: username })) as any;
    this.logger.info('UsersService#findByUsername.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    return result;
  }

  async findByEmail(email: string) {
    this.logger.info('UsersService#findByEmail.call', { email });
    const result = await firstValueFrom(this.usersGrpcService.findByEmail({ name: email })) as any;
    this.logger.info('UsersService#findByEmail.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    return result;
  }

  async findByAcsId(acsId: number) {
    this.logger.info('UsersService#findByAcsId.call', { acsId });
    const result = await firstValueFrom(this.usersGrpcService.findByAcsId({ id: acsId.toString() })) as any;
    this.logger.info('UsersService#findByAcsId.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    return result;
  }

  async findByIdWithProfile(id: string) {
    this.logger.info('UsersService#findByIdWithProfile.call', { id });
    const result = await firstValueFrom(this.usersGrpcService.getUserInfoWithProfile({ id })) as any;
    this.logger.info('UsersService#findByIdWithProfile.result', result);
    // Convert Long objects to numbers recursively
    this.convertLongToNumber(result);
    return result;
  }

  async count(query?: any) {
    this.logger.info('UsersService#count.call', query);
    const result = await firstValueFrom(this.usersGrpcService.count(query || {})) as any;
    this.logger.info('UsersService#count.result', result);
    return result.count || 0;
  }

  async create(data: any) {
    this.logger.info('UsersService#create.call', { username: data.username });
    const result = await firstValueFrom(this.usersGrpcService.create(data)) as any;
    this.logger.info('UsersService#create.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    return result;
  }

  async update(id: string, data: any) {
    this.logger.info('UsersService#update.call', { id, data });
    const result = await firstValueFrom(this.usersGrpcService.update({ id, ...data })) as any;
    this.logger.info('UsersService#update.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    return result;
  }

  async updateProfile(userId: string, data: any) {
    this.logger.info('UsersService#updateProfile.call', { userId, data });
    const result = await firstValueFrom(this.usersGrpcService.updateProfile({ userId, ...data })) as any;
    this.logger.info('UsersService#updateProfile.result', result);
    return result;
  }

  async delete(id: string) {
    this.logger.info('UsersService#delete.call', { id });
    const result = await firstValueFrom(this.usersGrpcService.destroy({ id })) as any;
    this.logger.info('UsersService#delete.result', result);
    return result;
  }

  // Role Management
  async createRole(data: any) {
    this.logger.info('UsersService#createRole.call', { code: data.code });
    const result = await firstValueFrom(this.usersGrpcService.CreateRole(data)) as any;
    return result;
  }

  async updateRole(data: any) {
    this.logger.info('UsersService#updateRole.call', { id: data.id });
    const result = await firstValueFrom(this.usersGrpcService.UpdateRole(data)) as any;
    return result;
  }

  async deleteRole(id: string) {
    this.logger.info('UsersService#deleteRole.call', { id });
    const result = await firstValueFrom(this.usersGrpcService.DeleteRole({ id })) as any;
    return result;
  }

  async getRoles(query?: any) {
    this.logger.info('UsersService#getRoles.call', query);
    const result = await firstValueFrom(this.usersGrpcService.GetRoles(query || {})) as any;
    return result;
  }

  async getRoleById(id: string) {
    this.logger.info('UsersService#getRoleById.call', { id });
    const result = await firstValueFrom(this.usersGrpcService.GetRoleById({ id })) as any;
    return result;
  }

  async getRoleByCode(code: string) {
    this.logger.info('UsersService#getRoleByCode.call', { code });
    const result = await firstValueFrom(this.usersGrpcService.GetRoleByCode({ name: code })) as any;
    return result;
  }

  async assignRole(userId: string, roleCode: string) {
    this.logger.info('UsersService#assignRole.call', { userId, roleCode });
    const result = await firstValueFrom(this.usersGrpcService.AssignRole({ userId, roleCode })) as any;
    return result;
  }

  async revokeRole(userId: string, roleCode: string) {
    this.logger.info('UsersService#revokeRole.call', { userId, roleCode });
    const result = await firstValueFrom(this.usersGrpcService.RevokeRole({ userId, roleCode })) as any;
    return result;
  }

  async getUserRoles(userId: string) {
    this.logger.info('UsersService#getUserRoles.call', { userId });
    const result = await firstValueFrom(this.usersGrpcService.GetUserRoles({ id: userId })) as any;
    return result;
  }

  /**
   * Convert Long objects to numbers recursively
   * gRPC serializes int64/Long as object {low, high, unsigned}
   * This method converts them back to JavaScript numbers
   */
  private convertLongToNumber(obj: any): void {
    if (!obj || typeof obj !== 'object') return;

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        // Check if value is a Long object { low, high, unsigned }
        if (value && typeof value === 'object' && 'low' in value && 'high' in value) {
          obj[key] = value.low + (value.high * 0x100000000);
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Recursive call for nested objects (but excluding arrays for safety/perf unless needed)
          // Profile is flat so recursion might not be strictly needed, but good for safety
          this.convertLongToNumber(value);
        }
      }
    }
  }

  // Device Token Management
  async saveDeviceToken(data: {
    userId: string;
    employeeCode: string;
    deviceToken: string;
    deviceType?: string;
    deviceName?: string;
    deviceOsVersion?: string;
    appVersion?: string;
  }): Promise<{ success: boolean; message: string }> {
    this.logger.info('UsersService#saveDeviceToken.call', { userId: data.userId });
    const result = await firstValueFrom(this.usersGrpcService.SaveDeviceToken(data)) as any;
    this.logger.info('UsersService#saveDeviceToken.result', result);
    return result;
  }

  async removeDeviceToken(deviceToken: string): Promise<{ success: boolean; message: string }> {
    this.logger.info('UsersService#removeDeviceToken.call');
    const result = await firstValueFrom(this.usersGrpcService.RemoveDeviceToken({ deviceToken })) as any;
    this.logger.info('UsersService#removeDeviceToken.result', result);
    return result;
  }

  async getDeviceTokens(employeeCode: string): Promise<{ tokens: string[] }> {
    this.logger.info('UsersService#getDeviceTokens.call', { employeeCode });
    const result = await firstValueFrom(this.usersGrpcService.GetDeviceTokens({ employeeCode })) as any;
    this.logger.info('UsersService#getDeviceTokens.result', result);
    return result;
  }
}

