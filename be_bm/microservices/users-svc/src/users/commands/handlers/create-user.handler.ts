import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { CreateUserCommand } from '../create-user.command';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../entities/user.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CreateUserHandler.name);
  }

  async execute(command: CreateUserCommand): Promise<User> {
    this.logger.info('CreateUserHandler#execute.call', { username: command.userDto.username });
    const user = await this.repository.create(command.userDto, command.passwordHash);
    this.logger.info('CreateUserHandler#execute.result', { id: user.id });
    return user;
  }
}

