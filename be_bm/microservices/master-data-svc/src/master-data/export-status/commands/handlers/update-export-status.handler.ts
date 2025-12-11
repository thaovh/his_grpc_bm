import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { UpdateExportStatusCommand } from '../update-export-status.command';
import { ExportStatusRepository } from '../../repositories/export-status.repository';
import { ExportStatus } from '../../entities/export-status.entity';

@CommandHandler(UpdateExportStatusCommand)
export class UpdateExportStatusHandler implements ICommandHandler<UpdateExportStatusCommand> {
  constructor(
    private readonly repository: ExportStatusRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UpdateExportStatusHandler.name);
  }

  async execute(command: UpdateExportStatusCommand): Promise<ExportStatus> {
    this.logger.info('UpdateExportStatusHandler#execute.call', { id: command.id });
    const ExportStatus = await this.repository.update(command.id, command.ExportStatusDto);
    this.logger.info('UpdateExportStatusHandler#execute.result', { id: ExportStatus.id });
    return ExportStatus;
  }
}

