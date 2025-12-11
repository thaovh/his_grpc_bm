import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { UpdatePasswordCommand } from '../update-password.command';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../entities/user.entity';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler implements ICommandHandler<UpdatePasswordCommand> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UpdatePasswordHandler.name);
  }

  async execute(command: UpdatePasswordCommand): Promise<User> {
    this.logger.info('UpdatePasswordHandler#execute.call', { id: command.id });
    const user = await this.repository.updatePassword(command.id, command.passwordHash);
    this.logger.info('UpdatePasswordHandler#execute.result', { id: user.id });
    return user;
  }
}

