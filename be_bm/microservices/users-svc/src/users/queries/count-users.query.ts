import { IQuery } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import { User } from '../entities/user.entity';

export class CountUsersQuery implements IQuery {
  constructor(public readonly options?: FindManyOptions<User>) {}
}

