import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetExpMestMedicineByIdQuery } from '../get-exp-mest-medicine-by-id.query';
import { ExpMestMedicineRepository } from '../../repositories/exp-mest-medicine.repository';
import { ExpMestMedicine } from '../../entities/exp-mest-medicine.entity';

@QueryHandler(GetExpMestMedicineByIdQuery)
export class GetExpMestMedicineByIdHandler implements IQueryHandler<GetExpMestMedicineByIdQuery> {
  constructor(
    private readonly repository: ExpMestMedicineRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetExpMestMedicineByIdHandler.name);
  }

  async execute(query: GetExpMestMedicineByIdQuery): Promise<ExpMestMedicine | null> {
    this.logger.info('GetExpMestMedicineByIdHandler#execute.call', { id: query.id });
    return this.repository.findById(query.id);
  }
}

