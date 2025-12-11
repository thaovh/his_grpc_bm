import { ICommand } from '@nestjs/cqrs';
import { UpdateExpMestDto } from '../dto/update-exp-mest.dto';

export class UpdateExpMestCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly expMestDto: UpdateExpMestDto,
  ) {}
}

