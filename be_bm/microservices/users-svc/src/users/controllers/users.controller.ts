import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { isEmpty } from 'lodash';

import { Query, Count, Id, Name } from '../../commons/interfaces/commons.interface';
import { UsersService, UsersQueryResult } from '../users.interface';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import * as bcrypt from 'bcrypt';

@Controller()
export class UsersController {
  constructor(
    @Inject('UsersService') private readonly usersService: UsersService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(UsersController.name);
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

    return result;
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

    this.logger.info('UsersController#findByUsername.result', result);

    return result;
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

    return result;
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

    return result;
  }

  @GrpcMethod('UsersService', 'findByIdWithProfile')
  async findByIdWithProfile(data: Id): Promise<{ user: User; profile: UserProfile | null }> {
    this.logger.info('UsersController#findByIdWithProfile.call', data);

    const result = await this.usersService.findByIdWithProfile(data.id);

    if (!result.user) {
      throw new Error('User not found');
    }

    // Convert Long objects to numbers for Oracle compatibility (gRPC may serialize back to Long)
    this.convertLongToNumber(result.user);

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
  async updateProfile(data: { userId: string; firstName?: string; lastName?: string; phone?: string; avatarUrl?: string; bio?: string; dateOfBirth?: string; address?: string }): Promise<UserProfile> {
    this.logger.info('UsersController#updateProfile.call', data);

    const { userId, ...profileData } = data;
    const updateDto: UpdateUserProfileDto = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phone: profileData.phone,
      avatarUrl: profileData.avatarUrl,
      bio: profileData.bio,
      dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
      address: profileData.address,
    };
    const result: UserProfile = await this.usersService.updateProfile(userId, updateDto);

    this.logger.info('UsersController#updateProfile.result', { id: result.id });

    return result;
  }

  @GrpcMethod('UsersService', 'destroy')
  async destroy(data: Id): Promise<Count> {
    this.logger.info('UsersController#destroy.call', data);

    await this.usersService.delete(data.id);

    this.logger.info('UsersController#destroy.result', { deleted: true });

    return { count: 1 };
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
}

