import { ICommand } from '@nestjs/cqrs';
import { UpdateExpMestMedicineDto } from '../dto/update-exp-mest-medicine.dto';

export class UpdateExpMestMedicineCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly medicineDto: UpdateExpMestMedicineDto,
  ) {}
}

