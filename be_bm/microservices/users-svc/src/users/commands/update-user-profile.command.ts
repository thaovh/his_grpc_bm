import { ICommand } from '@nestjs/cqrs';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';

export class UpdateUserProfileCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly profileDto: UpdateUserProfileDto,
  ) {}
}

