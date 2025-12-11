import { CreateUnitOfMeasureDto } from '../dto/create-unit-of-measure.dto';

export class CreateUnitOfMeasureCommand {
  constructor(public readonly unitOfMeasureDto: CreateUnitOfMeasureDto) {}
}

