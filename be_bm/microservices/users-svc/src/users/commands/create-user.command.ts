import { ICommand } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto/create-user.dto';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly userDto: CreateUserDto,
    public readonly passwordHash: string,
  ) {}
}

