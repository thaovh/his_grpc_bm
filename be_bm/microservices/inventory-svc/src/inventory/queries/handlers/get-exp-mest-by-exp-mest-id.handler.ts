import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetExpMestByExpMestIdQuery } from '../get-exp-mest-by-exp-mest-id.query';
import { InventoryRepository } from '../../repositories/inventory.repository';
import { ExpMest } from '../../entities/exp-mest.entity';

@QueryHandler(GetExpMestByExpMestIdQuery)
export class GetExpMestByExpMestIdHandler implements IQueryHandler<GetExpMestByExpMestIdQuery> {
  constructor(
    private readonly repository: InventoryRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetExpMestByExpMestIdHandler.name);
  }

  async execute(query: GetExpMestByExpMestIdQuery): Promise<ExpMest | null> {
    this.logger.info('GetExpMestByExpMestIdHandler#execute.call', { expMestId: query.expMestId });
    const result = await this.repository.findByExpMestId(query.expMestId);
    this.logger.info('GetExpMestByExpMestIdHandler#execute.result', { found: !!result });
    return result;
  }
}

