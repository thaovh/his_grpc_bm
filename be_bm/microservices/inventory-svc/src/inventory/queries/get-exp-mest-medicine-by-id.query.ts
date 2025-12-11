import { IQuery } from '@nestjs/cqrs';

export class GetExpMestMedicineByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

