import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetExpMestMedicineByHisIdQuery } from '../get-exp-mest-medicine-by-his-id.query';
import { ExpMestMedicineRepository } from '../../repositories/exp-mest-medicine.repository';
import { ExpMestMedicine } from '../../entities/exp-mest-medicine.entity';

@QueryHandler(GetExpMestMedicineByHisIdQuery)
export class GetExpMestMedicineByHisIdHandler implements IQueryHandler<GetExpMestMedicineByHisIdQuery> {
  constructor(
    private readonly repository: ExpMestMedicineRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetExpMestMedicineByHisIdHandler.name);
  }

  async execute(query: GetExpMestMedicineByHisIdQuery): Promise<ExpMestMedicine | null> {
    this.logger.info('GetExpMestMedicineByHisIdHandler#execute.call', { hisId: query.hisId });
    return this.repository.findByHisId(query.hisId);
  }
}

