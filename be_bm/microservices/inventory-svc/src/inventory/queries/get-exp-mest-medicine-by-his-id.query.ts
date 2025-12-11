import { IQuery } from '@nestjs/cqrs';

export class GetExpMestMedicineByHisIdQuery implements IQuery {
  constructor(public readonly hisId: number) {}
}

