import { FindManyOptions, FindOneOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

export interface UsersQueryResult {
  data: Array<User>;
}

export interface UsersService {
  findAll(query?: FindManyOptions<User>): Promise<Array<User>>;
  findOne(query?: FindOneOptions<User>): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByAcsId(acsId: number): Promise<User | null>;
  findByIdWithProfile(id: string): Promise<{ user: User; profile: UserProfile | null }>;
  count(query?: FindManyOptions<User>): Promise<number>;
  create(userDto: CreateUserDto, passwordHash: string): Promise<User>;
  update(id: string, data: Partial<{ email: string; acsId: number | null }>): Promise<User>;
  updateProfile(userId: string, profileDto: UpdateUserProfileDto): Promise<UserProfile>;
  updatePassword(id: string, passwordHash: string): Promise<User>;
  delete(id: string): Promise<void>;

  // Device Token Management
  saveDeviceToken(request: {
    userId: string;
    employeeCode: string;
    deviceToken: string;
    deviceType?: string;
    deviceName?: string;
    deviceOsVersion?: string;
    appVersion?: string;
  }): Promise<{ success: boolean; message: string }>;

  removeDeviceToken(request: { deviceToken: string }): Promise<{ success: boolean; message: string }>;

  getDeviceTokens(request: { employeeCode: string }): Promise<{ tokens: string[] }>;
}

