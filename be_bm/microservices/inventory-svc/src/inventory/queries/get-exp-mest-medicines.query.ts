import { IQuery } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import { ExpMestMedicine } from '../entities/exp-mest-medicine.entity';

export class GetExpMestMedicinesQuery implements IQuery {
  constructor(public readonly options?: FindManyOptions<ExpMestMedicine>) {}
}

