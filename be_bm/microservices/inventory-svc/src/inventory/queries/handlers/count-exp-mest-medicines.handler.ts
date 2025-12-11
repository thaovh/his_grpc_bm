import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { CountExpMestMedicinesQuery } from '../count-exp-mest-medicines.query';
import { ExpMestMedicineRepository } from '../../repositories/exp-mest-medicine.repository';

@QueryHandler(CountExpMestMedicinesQuery)
export class CountExpMestMedicinesHandler implements IQueryHandler<CountExpMestMedicinesQuery> {
  constructor(
    private readonly repository: ExpMestMedicineRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CountExpMestMedicinesHandler.name);
  }

  async execute(query: CountExpMestMedicinesQuery): Promise<number> {
    this.logger.info('CountExpMestMedicinesHandler#execute.call', query.options);
    return this.repository.count(query.options);
  }
}

