import { IQuery } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import { User } from '../entities/user.entity';

export class GetUsersQuery implements IQuery {
  constructor(public readonly options?: FindManyOptions<User>) {}
}

