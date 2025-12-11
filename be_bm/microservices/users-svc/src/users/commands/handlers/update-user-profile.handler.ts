import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { UpdateUserProfileCommand } from '../update-user-profile.command';
import { UsersRepository } from '../../repositories/users.repository';
import { UserProfile } from '../../entities/user-profile.entity';

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileHandler implements ICommandHandler<UpdateUserProfileCommand> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UpdateUserProfileHandler.name);
  }

  async execute(command: UpdateUserProfileCommand): Promise<UserProfile> {
    this.logger.info('UpdateUserProfileHandler#execute.call', { userId: command.userId });
    const profile = await this.repository.updateProfile(command.userId, command.profileDto);
    this.logger.info('UpdateUserProfileHandler#execute.result', { id: profile.id });
    return profile;
  }
}

