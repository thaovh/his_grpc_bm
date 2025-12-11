import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, Raw } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserProfileDto } from '../dto/create-user-profile.dto';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersRepository.name);
  }

  async findAll(options?: FindManyOptions<User>): Promise<User[]> {
    this.logger.info('UsersRepository#findAll.call', options);
    const result = await this.userRepository.find({
      ...options,
      relations: ['profile'], // Include profile if needed
    });
    // Convert Long objects to numbers for Oracle compatibility
    result.forEach(user => this.convertLongToNumber(user));
    this.logger.info('UsersRepository#findAll.result', { count: result.length });
    return result;
  }

  async findOne(options?: FindOneOptions<User>): Promise<User | null> {
    this.logger.info('UsersRepository#findOne.call', options);
    const result = await this.userRepository.findOne({
      ...options,
      relations: ['profile'], // Include profile
    });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('UsersRepository#findOne.result', { found: !!result });
    return result;
  }

  async findById(id: string): Promise<User | null> {
    this.logger.info('UsersRepository#findById.call', { id });
    const result = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'userRoles', 'userRoles.role'],
    });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('UsersRepository#findById.result', { found: !!result });
    return result;
  }

  async findByUsername(username: string): Promise<User | null> {
    this.logger.info('UsersRepository#findByUsername.call', { username });
    const result = await this.userRepository.findOne({
      where: { username: Raw(alias => `LOWER(${alias}) = LOWER(:value)`, { value: username }) },
      relations: ['profile', 'userRoles', 'userRoles.role'],
    });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('UsersRepository#findByUsername.result', { found: !!result });
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.info('UsersRepository#findByEmail.call', { email });
    const result = await this.userRepository.findOne({
      where: { email },
      relations: ['profile', 'userRoles', 'userRoles.role'],
    });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('UsersRepository#findByEmail.result', { found: !!result });
    return result;
  }

  async findByAcsId(acsId: number): Promise<User | null> {
    this.logger.info('UsersRepository#findByAcsId.call', { acsId });
    const result = await this.userRepository.findOne({
      where: { acsId },
      relations: ['profile'],
    });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('UsersRepository#findByAcsId.result', { found: !!result });
    return result;
  }

  async count(options?: FindManyOptions<User>): Promise<number> {
    this.logger.info('UsersRepository#count.call', options);
    const result = await this.userRepository.count(options);
    this.logger.info('UsersRepository#count.result', { count: result });
    return result;
  }

  async create(userDto: CreateUserDto, passwordHash: string): Promise<User> {
    this.logger.info('UsersRepository#create.call', { username: userDto.username });

    // Generate UUID manually for Oracle compatibility
    const { randomUUID } = require('crypto');
    const userId = randomUUID();
    const now = new Date();

    // Create user entity - explicitly set ALL fields (including nullable) to avoid DEFAULT values
    // DEFAULT values trigger RETURNING clause which is not supported in Oracle thin mode
    const userData: any = {
      id: userId,
      username: userDto.username,
      email: userDto.email,
      passwordHash,
      isActive: 1,
      version: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null, // Explicit null to avoid DEFAULT
      createdBy: null, // Explicit null to avoid DEFAULT
      updatedBy: null, // Explicit null to avoid DEFAULT
    };

    // Only set acsId if it has a value (not undefined)
    // Convert to number if it's a Long object (from gRPC int64)
    if (userDto.acsId !== undefined && userDto.acsId !== null) {
      const acsIdValue: number | { low: number; high: number } = userDto.acsId as any;
      // Handle Long object from gRPC int64 - convert to number
      if (typeof acsIdValue === 'object' && acsIdValue !== null && 'low' in acsIdValue && 'high' in acsIdValue) {
        // It's a Long object, convert to number
        const longValue = acsIdValue as { low: number; high: number };
        userData.acsId = longValue.low + (longValue.high * 0x100000000);
      } else {
        userData.acsId = Number(acsIdValue);
      }
    } else {
      userData.acsId = null; // Explicit null to avoid DEFAULT
    }

    // Use save() - with all explicit values, TypeORM should not use RETURNING clause
    const user = this.userRepository.create(userData);
    await this.userRepository.save(user);

    // Fetch the saved user with profile
    const savedUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile']
    });

    if (!savedUser) {
      throw new Error('Failed to fetch created user');
    }

    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(savedUser);

    // Create profile if profile data provided
    if (userDto.firstName || userDto.lastName || userDto.phone || userDto.avatarUrl || userDto.bio || userDto.dateOfBirth || userDto.address) {
      // Set ALL fields explicit (including nullable) to avoid DEFAULT values triggering RETURNING clause
      const profileData: any = {
        id: randomUUID(),
        userId: userId,
        isActive: 1,
        version: 1,
        createdAt: now,
        updatedAt: now,
        deletedAt: null, // Explicit null to avoid DEFAULT
        createdBy: null, // Explicit null to avoid DEFAULT
        updatedBy: null, // Explicit null to avoid DEFAULT
        firstName: userDto.firstName || null,
        lastName: userDto.lastName || null,
        phone: userDto.phone || null,
        avatarUrl: userDto.avatarUrl || null,
        bio: userDto.bio || null,
        dateOfBirth: userDto.dateOfBirth || null,
        address: userDto.address || null,
        // HIS Employee fields - initialized as null (will be enriched later)
        diploma: null,
        isDoctor: null,
        isNurse: null,
        title: null,
        careerTitleId: null,
        departmentId: null,
        branchId: null,
        defaultMediStockIds: null,
        genderId: null,
        ethnicCode: null,
        identificationNumber: null,
        socialInsuranceNumber: null,
        diplomaDate: null,
        diplomaPlace: null,
        maxServiceReqPerDay: null,
        doNotAllowSimultaneity: null,
        isAdmin: null,
      };

      // Use save() - with all explicit values, TypeORM should not use RETURNING clause
      const profile = this.profileRepository.create(profileData);
      await this.profileRepository.save(profile);
    }

    // Fetch user with profile (already fetched above, but refresh to get profile if created)
    const userWithProfile = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile']
    });

    if (userWithProfile) {
      // Convert Long objects to numbers for Oracle compatibility
      this.convertLongToNumber(userWithProfile);
    }

    // Assign default USER role to new user
    try {
      const defaultRole = await this.roleRepository.findOne({ where: { code: 'USER' } });
      if (defaultRole) {
        const { randomUUID } = require('crypto');
        const userRoleData: any = {
          id: randomUUID(),
          userId: userId,
          roleId: defaultRole.id,
          isActive: 1,
          version: 1,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
          createdBy: null,
          updatedBy: null,
        };
        const userRole = this.userRoleRepository.create(userRoleData);
        await this.userRoleRepository.save(userRole);
        this.logger.info('UsersRepository#create.defaultRoleAssigned', { userId, roleCode: 'USER' });
      } else {
        this.logger.warn('UsersRepository#create.defaultRoleNotFound', { roleCode: 'USER' });
      }
    } catch (error) {
      this.logger.error('UsersRepository#create.roleAssignmentFailed', { error: error.message });
      // Don't throw - user creation should succeed even if role assignment fails
    }

    this.logger.info('UsersRepository#create.result', { id: userWithProfile.id });
    return userWithProfile;
  }

  async update(id: string, data: Partial<CreateUserDto>): Promise<User> {
    this.logger.info('UsersRepository#update.call', { id, data });
    await this.userRepository.update(id, data);
    const result = await this.findById(id);
    this.logger.info('UsersRepository#update.result', { id: result?.id });
    if (!result) {
      throw new Error('User not found after update');
    }
    // convertLongToNumber already called in findById
    return result;
  }

  async updatePassword(id: string, passwordHash: string): Promise<User> {
    this.logger.info('UsersRepository#updatePassword.call', { id });
    await this.userRepository.update(id, { passwordHash });
    const result = await this.findById(id);
    this.logger.info('UsersRepository#updatePassword.result', { id: result?.id });
    if (!result) {
      throw new Error('User not found after password update');
    }
    // convertLongToNumber already called in findById
    return result;
  }

  async delete(id: string): Promise<void> {
    this.logger.info('UsersRepository#delete.call', { id });
    await this.userRepository.delete(id);
    this.logger.info('UsersRepository#delete.result', { deleted: true });
  }

  // Profile methods
  async createProfile(profileDto: CreateUserProfileDto): Promise<UserProfile> {
    this.logger.info('UsersRepository#createProfile.call', profileDto);
    const profile = this.profileRepository.create(profileDto);
    const result = await this.profileRepository.save(profile);
    this.logger.info('UsersRepository#createProfile.result', { id: result.id });
    return result;
  }

  async updateProfile(userId: string, data: UpdateUserProfileDto): Promise<UserProfile> {
    this.logger.info('UsersRepository#updateProfile.call', { userId, data });

    // Check if profile exists
    let profile = await this.profileRepository.findOne({ where: { userId } });

    if (!profile) {
      // Profile doesn't exist, create new one
      this.logger.info('UsersRepository#updateProfile.profileNotFound.creating', { userId });
      const { randomUUID } = require('crypto');
      const profileId = randomUUID();
      const now = new Date();

      const profileData: any = {
        id: profileId,
        userId,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phone: data.phone || null,
        avatarUrl: data.avatarUrl || null,
        bio: data.bio || null,
        dateOfBirth: data.dateOfBirth || null,
        address: data.address || null,
        // HIS Employee fields
        diploma: data.diploma || null,
        isDoctor: data.isDoctor !== undefined ? data.isDoctor : null,
        isNurse: data.isNurse !== undefined ? data.isNurse : null,
        title: data.title || null,
        careerTitleId: data.careerTitleId !== undefined ? data.careerTitleId : null,
        departmentId: data.departmentId !== undefined ? data.departmentId : null,
        branchId: data.branchId !== undefined ? data.branchId : null,
        defaultMediStockIds: data.defaultMediStockIds || null,
        genderId: data.genderId !== undefined ? data.genderId : null,
        ethnicCode: data.ethnicCode || null,
        identificationNumber: data.identificationNumber || null,
        socialInsuranceNumber: data.socialInsuranceNumber || null,
        diplomaDate: data.diplomaDate || null,
        diplomaPlace: data.diplomaPlace || null,
        maxServiceReqPerDay: data.maxServiceReqPerDay !== undefined ? data.maxServiceReqPerDay : null,
        doNotAllowSimultaneity: data.doNotAllowSimultaneity !== undefined ? data.doNotAllowSimultaneity : null,
        isAdmin: data.isAdmin !== undefined ? data.isAdmin : null,
        isActive: 1,
        version: 1,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        createdBy: null,
        updatedBy: null,
      };

      const newProfile = this.profileRepository.create(profileData);
      const savedProfile = await this.profileRepository.save(newProfile);
      profile = Array.isArray(savedProfile) ? savedProfile[0] : savedProfile;
      this.logger.info('UsersRepository#updateProfile.profileCreated', { id: profile.id });
    } else {
      // Profile exists, update it
      await this.profileRepository.update({ userId }, data);
      profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) {
        throw new Error('UserProfile not found after update');
      }
      this.logger.info('UsersRepository#updateProfile.profileUpdated', { id: profile.id });
    }

    return profile;
  }

  async findProfileByUserId(userId: string): Promise<UserProfile | null> {
    this.logger.info('UsersRepository#findProfileByUserId.call', { userId });
    const result = await this.profileRepository.findOne({ where: { userId } });
    this.logger.info('UsersRepository#findProfileByUserId.result', { found: !!result });
    return result;
  }

  /**
   * Convert Long objects to numbers for Oracle compatibility
   * Oracle returns NUMBER(19,0) as Long object {low, high, unsigned}
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

