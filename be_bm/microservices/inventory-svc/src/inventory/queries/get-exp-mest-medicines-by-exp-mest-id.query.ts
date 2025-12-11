import { IQuery } from '@nestjs/cqrs';

export class GetExpMestMedicinesByExpMestIdQuery implements IQuery {
  constructor(public readonly expMestId: number) {}
}

