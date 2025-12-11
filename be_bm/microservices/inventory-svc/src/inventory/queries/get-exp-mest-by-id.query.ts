import { IQuery } from '@nestjs/cqrs';

export class GetExpMestByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

