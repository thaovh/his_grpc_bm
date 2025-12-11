import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { UpdateExpMestMedicineCommand } from '../update-exp-mest-medicine.command';
import { ExpMestMedicineRepository } from '../../repositories/exp-mest-medicine.repository';
import { ExpMestMedicine } from '../../entities/exp-mest-medicine.entity';

@CommandHandler(UpdateExpMestMedicineCommand)
export class UpdateExpMestMedicineHandler implements ICommandHandler<UpdateExpMestMedicineCommand> {
  constructor(
    private readonly repository: ExpMestMedicineRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UpdateExpMestMedicineHandler.name);
  }

  async execute(command: UpdateExpMestMedicineCommand): Promise<ExpMestMedicine> {
    this.logger.info('UpdateExpMestMedicineHandler#execute.call', { id: command.id });
    const medicine = await this.repository.update(command.id, command.medicineDto);
    this.logger.info('UpdateExpMestMedicineHandler#execute.result', { id: medicine.id });
    return medicine;
  }
}

