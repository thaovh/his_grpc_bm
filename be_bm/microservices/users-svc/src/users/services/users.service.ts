import { PinoLogger } from 'nestjs-pino';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOptions, FindOneOptions } from 'typeorm';

import { UsersService } from '../users.interface';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';

import { CreateUserCommand } from '../commands/create-user.command';
import { UpdateUserCommand } from '../commands/update-user.command';
import { UpdateUserProfileCommand } from '../commands/update-user-profile.command';
import { GetUsersQuery } from '../queries/get-users.query';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';
import { GetUserByUsernameQuery } from '../queries/get-user-by-username.query';
import { GetUserByEmailQuery } from '../queries/get-user-by-email.query';
import { GetUserByAcsIdQuery } from '../queries/get-user-by-acs-id.query';
import { CountUsersQuery } from '../queries/count-users.query';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersServiceImpl implements UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly repository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersServiceImpl.name);
  }

  async findAll(query?: FindManyOptions<User>): Promise<Array<User>> {
    this.logger.info('UsersService#findAll.call', query);
    return this.queryBus.execute(new GetUsersQuery(query));
  }

  async findOne(query?: FindOneOptions<User>): Promise<User | null> {
    this.logger.info('UsersService#findOne.call', query);
    const result = await this.queryBus.execute(new GetUsersQuery(query as FindManyOptions<User>));
    return result[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    this.logger.info('UsersService#findById.call', { id });
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  async findByUsername(username: string): Promise<User | null> {
    this.logger.info('UsersService#findByUsername.call', { username });
    return this.queryBus.execute(new GetUserByUsernameQuery(username));
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.info('UsersService#findByEmail.call', { email });
    return this.queryBus.execute(new GetUserByEmailQuery(email));
  }

  async findByAcsId(acsId: number): Promise<User | null> {
    this.logger.info('UsersService#findByAcsId.call', { acsId });
    return this.queryBus.execute(new GetUserByAcsIdQuery(acsId));
  }

  async findByIdWithProfile(id: string): Promise<{ user: User; profile: UserProfile | null }> {
    this.logger.info('UsersService#findByIdWithProfile.call', { id });
    const user = await this.findById(id);
    if (!user) {
      return { user: null as any, profile: null };
    }
    const profile = await this.repository.findProfileByUserId(id);
    return { user, profile };
  }

  async count(query?: FindManyOptions<User>): Promise<number> {
    this.logger.info('UsersService#count.call', query);
    return this.queryBus.execute(new CountUsersQuery(query));
  }

  async create(userDto: CreateUserDto, passwordHash: string): Promise<User> {
    this.logger.info('UsersService#create.call', { username: userDto.username });
    return this.commandBus.execute(new CreateUserCommand(userDto, passwordHash));
  }

  async update(id: string, data: Partial<{ email: string; acsId: number | null }>): Promise<User> {
    this.logger.info('UsersService#update.call', { id, data });
    return this.commandBus.execute(new UpdateUserCommand(id, data));
  }

  async updateProfile(userId: string, profileDto: UpdateUserProfileDto): Promise<UserProfile> {
    this.logger.info('UsersService#updateProfile.call', { userId });
    return this.commandBus.execute(new UpdateUserProfileCommand(userId, profileDto));
  }

  async delete(id: string): Promise<void> {
    this.logger.info('UsersService#delete.call', { id });
    await this.repository.delete(id);
  }
}

