import { ICommand } from '@nestjs/cqrs';
import { CreateExpMestMedicineDto } from '../dto/create-exp-mest-medicine.dto';

export class CreateExpMestMedicineCommand implements ICommand {
  constructor(public readonly medicineDto: CreateExpMestMedicineDto) {}
}

