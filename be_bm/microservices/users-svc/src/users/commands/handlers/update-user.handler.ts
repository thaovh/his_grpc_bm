import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { UpdateUserCommand } from '../update-user.command';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../entities/user.entity';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UpdateUserHandler.name);
  }

  async execute(command: UpdateUserCommand): Promise<User> {
    this.logger.info('UpdateUserHandler#execute.call', { id: command.id });
    const user = await this.repository.update(command.id, command.data);
    this.logger.info('UpdateUserHandler#execute.result', { id: user.id });
    return user;
  }
}

