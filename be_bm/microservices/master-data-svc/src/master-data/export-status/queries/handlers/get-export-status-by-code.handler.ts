import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetExportStatusByCodeQuery } from '../get-export-status-by-code.query';
import { ExportStatusRepository } from '../../repositories/export-status.repository';
import { ExportStatus } from '../../entities/export-status.entity';

@QueryHandler(GetExportStatusByCodeQuery)
export class GetExportStatusByCodeHandler implements IQueryHandler<GetExportStatusByCodeQuery> {
  constructor(
    private readonly repository: ExportStatusRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetExportStatusByCodeHandler.name);
  }

  async execute(query: GetExportStatusByCodeQuery): Promise<ExportStatus | null> {
    this.logger.info('GetExportStatusByCodeHandler#execute.call', { code: query.code });
    return this.repository.findByCode(query.code);
  }
}

