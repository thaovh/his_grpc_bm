import { FindManyOptions } from 'typeorm';
import { UnitOfMeasure } from '../entities/unit-of-measure.entity';

export class CountUnitOfMeasuresQuery {
  constructor(public readonly options?: FindManyOptions<UnitOfMeasure>) {}
}
