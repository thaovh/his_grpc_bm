import { PartialType } from '@nestjs/swagger';
import { CreateExpMestDto } from './create-exp-mest.dto';

export class UpdateExpMestDto extends PartialType(CreateExpMestDto) {
  // Remove expMestId from update (it's immutable)
}

