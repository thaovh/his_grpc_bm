import { IQuery } from '@nestjs/cqrs';

export class GetUserByAcsIdQuery implements IQuery {
  constructor(public readonly acsId: number) {}
}

