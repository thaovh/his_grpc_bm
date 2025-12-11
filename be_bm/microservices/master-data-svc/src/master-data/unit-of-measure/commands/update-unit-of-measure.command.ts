import { UpdateUnitOfMeasureDto } from '../dto/update-unit-of-measure.dto';

export class UpdateUnitOfMeasureCommand {
  constructor(
    public readonly id: string,
    public readonly unitOfMeasureDto: UpdateUnitOfMeasureDto,
  ) {}
}

