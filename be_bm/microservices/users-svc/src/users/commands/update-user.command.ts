import { ICommand } from '@nestjs/cqrs';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly data: Partial<{ email: string; acsId: number | null }>,
  ) {}
}

