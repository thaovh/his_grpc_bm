import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetExpMestMedicinesQuery } from '../get-exp-mest-medicines.query';
import { ExpMestMedicineRepository } from '../../repositories/exp-mest-medicine.repository';
import { ExpMestMedicine } from '../../entities/exp-mest-medicine.entity';

@QueryHandler(GetExpMestMedicinesQuery)
export class GetExpMestMedicinesHandler implements IQueryHandler<GetExpMestMedicinesQuery> {
  constructor(
    private readonly repository: ExpMestMedicineRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetExpMestMedicinesHandler.name);
  }

  async execute(query: GetExpMestMedicinesQuery): Promise<ExpMestMedicine[]> {
    this.logger.info('GetExpMestMedicinesHandler#execute.call', query.options);
    return this.repository.findAll(query.options);
  }
}

