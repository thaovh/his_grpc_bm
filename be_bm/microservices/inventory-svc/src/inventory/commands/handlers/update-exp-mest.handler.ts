import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { UpdateExpMestCommand } from '../update-exp-mest.command';
import { InventoryRepository } from '../../repositories/inventory.repository';
import { ExpMest } from '../../entities/exp-mest.entity';

@CommandHandler(UpdateExpMestCommand)
export class UpdateExpMestHandler implements ICommandHandler<UpdateExpMestCommand> {
  constructor(
    private readonly repository: InventoryRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UpdateExpMestHandler.name);
  }

  async execute(command: UpdateExpMestCommand): Promise<ExpMest> {
    this.logger.info('UpdateExpMestHandler#execute.call', { id: command.id });
    const expMest = await this.repository.update(command.id, command.expMestDto);
    this.logger.info('UpdateExpMestHandler#execute.result', { id: expMest.id });
    return expMest;
  }
}

