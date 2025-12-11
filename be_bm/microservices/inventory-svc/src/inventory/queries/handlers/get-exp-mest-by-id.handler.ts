import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetExpMestByIdQuery } from '../get-exp-mest-by-id.query';
import { InventoryRepository } from '../../repositories/inventory.repository';
import { ExpMest } from '../../entities/exp-mest.entity';

@QueryHandler(GetExpMestByIdQuery)
export class GetExpMestByIdHandler implements IQueryHandler<GetExpMestByIdQuery> {
  constructor(
    private readonly repository: InventoryRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetExpMestByIdHandler.name);
  }

  async execute(query: GetExpMestByIdQuery): Promise<ExpMest | null> {
    this.logger.info('GetExpMestByIdHandler#execute.call', { id: query.id });
    const result = await this.repository.findById(query.id);
    this.logger.info('GetExpMestByIdHandler#execute.result', { found: !!result });
    return result;
  }
}

