import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { CountExpMestsQuery } from '../count-exp-mests.query';
import { InventoryRepository } from '../../repositories/inventory.repository';

@QueryHandler(CountExpMestsQuery)
export class CountExpMestsHandler implements IQueryHandler<CountExpMestsQuery> {
  constructor(
    private readonly repository: InventoryRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CountExpMestsHandler.name);
  }

  async execute(query: CountExpMestsQuery): Promise<number> {
    this.logger.info('CountExpMestsHandler#execute.call', query.options);
    const result = await this.repository.count(query.options);
    this.logger.info('CountExpMestsHandler#execute.result', { count: result });
    return result;
  }
}

