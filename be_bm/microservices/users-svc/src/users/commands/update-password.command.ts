import { ICommand } from '@nestjs/cqrs';

export class UpdatePasswordCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly passwordHash: string,
  ) {}
}

