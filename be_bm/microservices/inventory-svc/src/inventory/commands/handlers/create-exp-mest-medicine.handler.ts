import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { CreateExpMestMedicineCommand } from '../create-exp-mest-medicine.command';
import { ExpMestMedicineRepository } from '../../repositories/exp-mest-medicine.repository';
import { ExpMestMedicine } from '../../entities/exp-mest-medicine.entity';

@CommandHandler(CreateExpMestMedicineCommand)
export class CreateExpMestMedicineHandler implements ICommandHandler<CreateExpMestMedicineCommand> {
  constructor(
    private readonly repository: ExpMestMedicineRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CreateExpMestMedicineHandler.name);
  }

  async execute(command: CreateExpMestMedicineCommand): Promise<ExpMestMedicine> {
    this.logger.info('CreateExpMestMedicineHandler#execute.call', { hisId: command.medicineDto.hisId, expMestId: command.medicineDto.expMestId });
    const medicine = await this.repository.create(command.medicineDto);
    this.logger.info('CreateExpMestMedicineHandler#execute.result', { id: medicine.id, hisId: medicine.hisId });
    return medicine;
  }
}

