import { PartialType } from '@nestjs/swagger';
import { CreateExpMestMedicineDto } from './create-exp-mest-medicine.dto';

export class UpdateExpMestMedicineDto extends PartialType(CreateExpMestMedicineDto) {
  // Remove hisId from update (it's immutable)
}

