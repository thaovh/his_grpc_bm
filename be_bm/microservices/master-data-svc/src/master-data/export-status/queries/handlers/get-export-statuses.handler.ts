import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetExportStatusesQuery } from '../get-export-statuses.query';
import { ExportStatusRepository } from '../../repositories/export-status.repository';
import { ExportStatus } from '../../entities/export-status.entity';

@QueryHandler(GetExportStatusesQuery)
export class GetExportStatusesHandler implements IQueryHandler<GetExportStatusesQuery> {
  constructor(
    private readonly repository: ExportStatusRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetExportStatusesHandler.name);
  }

  async execute(query: GetExportStatusesQuery): Promise<ExportStatus[]> {
    this.logger.info('GetExportStatusesHandler#execute.call', query.options);
    return this.repository.findAll(query.options);
  }
}
