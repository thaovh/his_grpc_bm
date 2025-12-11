import { ICommand } from '@nestjs/cqrs';
import { CreateExpMestDto } from '../dto/create-exp-mest.dto';

export class CreateExpMestCommand implements ICommand {
  constructor(public readonly expMestDto: CreateExpMestDto) {}
}

