import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { CreateExportStatusCommand } from '../create-export-status.command';
import { ExportStatusRepository } from '../../repositories/export-status.repository';
import { ExportStatus } from '../../entities/export-status.entity';

@CommandHandler(CreateExportStatusCommand)
export class CreateExportStatusHandler implements ICommandHandler<CreateExportStatusCommand> {
  constructor(
    private readonly repository: ExportStatusRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CreateExportStatusHandler.name);
  }

  async execute(command: CreateExportStatusCommand): Promise<ExportStatus> {
    this.logger.info('CreateExportStatusHandler#execute.call', { code: command.ExportStatusDto.code });
    const ExportStatus = await this.repository.create(command.ExportStatusDto);
    this.logger.info('CreateExportStatusHandler#execute.result', { id: ExportStatus.id, code: ExportStatus.code });
    return ExportStatus;
  }
}

