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
  findByIdWithProfile(data: { id: string }): any;
  count(data: any): any;
  create(data: any): any;
  update(data: any): any;
  updateProfile(data: any): any;
  destroy(data: { id: string }): any;
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
    const result = await firstValueFrom(this.usersGrpcService.findByIdWithProfile({ id })) as any;
    this.logger.info('UsersService#findByIdWithProfile.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    if (result.user) {
      this.convertLongToNumber(result.user);
    }
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

  /**
   * Convert Long objects to numbers for Oracle compatibility
   * gRPC serializes NUMBER(19,0) as Long object {low, high, unsigned}
   * This method converts it back to number
   */
  private convertLongToNumber(user: any): void {
    if (user && user.acsId !== null && user.acsId !== undefined) {
      const acsIdValue: number | { low: number; high: number } | null = user.acsId as any;
      if (acsIdValue !== null && typeof acsIdValue === 'object' && 'low' in acsIdValue && 'high' in acsIdValue) {
        const longValue = acsIdValue as { low: number; high: number };
        user.acsId = longValue.low + (longValue.high * 0x100000000);
      }
    }
  }
}

