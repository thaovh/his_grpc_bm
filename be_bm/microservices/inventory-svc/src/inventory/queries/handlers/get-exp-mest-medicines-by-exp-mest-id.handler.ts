import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetExpMestMedicinesByExpMestIdQuery } from '../get-exp-mest-medicines-by-exp-mest-id.query';
import { ExpMestMedicineRepository } from '../../repositories/exp-mest-medicine.repository';
import { ExpMestMedicine } from '../../entities/exp-mest-medicine.entity';

@QueryHandler(GetExpMestMedicinesByExpMestIdQuery)
export class GetExpMestMedicinesByExpMestIdHandler implements IQueryHandler<GetExpMestMedicinesByExpMestIdQuery> {
  constructor(
    private readonly repository: ExpMestMedicineRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetExpMestMedicinesByExpMestIdHandler.name);
  }

  async execute(query: GetExpMestMedicinesByExpMestIdQuery): Promise<ExpMestMedicine[]> {
    this.logger.info('GetExpMestMedicinesByExpMestIdHandler#execute.call', { expMestId: query.expMestId });
    return this.repository.findByExpMestId(query.expMestId);
  }
}

