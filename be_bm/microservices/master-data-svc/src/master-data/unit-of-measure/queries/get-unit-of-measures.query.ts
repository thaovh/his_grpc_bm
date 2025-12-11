import { FindManyOptions } from 'typeorm';
import { UnitOfMeasure } from '../entities/unit-of-measure.entity';

export class GetUnitOfMeasuresQuery {
  constructor(public readonly options?: FindManyOptions<UnitOfMeasure>) {}
}
