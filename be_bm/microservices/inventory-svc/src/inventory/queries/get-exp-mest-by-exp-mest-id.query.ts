import { IQuery } from '@nestjs/cqrs';

export class GetExpMestByExpMestIdQuery implements IQuery {
  constructor(public readonly expMestId: number) {}
}

