import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { CreateExpMestCommand } from '../create-exp-mest.command';
import { InventoryRepository } from '../../repositories/inventory.repository';
import { ExpMest } from '../../entities/exp-mest.entity';

@CommandHandler(CreateExpMestCommand)
export class CreateExpMestHandler implements ICommandHandler<CreateExpMestCommand> {
  constructor(
    private readonly repository: InventoryRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CreateExpMestHandler.name);
  }

  async execute(command: CreateExpMestCommand): Promise<ExpMest> {
    this.logger.info('CreateExpMestHandler#execute.call', { expMestId: command.expMestDto.expMestId });
    const expMest = await this.repository.create(command.expMestDto);
    this.logger.info('CreateExpMestHandler#execute.result', { id: expMest.id, expMestId: expMest.expMestId });
    return expMest;
  }
}

