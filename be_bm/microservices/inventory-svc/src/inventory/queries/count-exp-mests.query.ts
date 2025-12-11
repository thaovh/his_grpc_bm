import { IQuery } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import { ExpMest } from '../entities/exp-mest.entity';

export class CountExpMestsQuery implements IQuery {
  constructor(public readonly options?: FindManyOptions<ExpMest>) {}
}

