import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { CountExportStatusesQuery } from '../count-export-statuses.query';
import { ExportStatusRepository } from '../../repositories/export-status.repository';

@QueryHandler(CountExportStatusesQuery)
export class CountExportStatusesHandler implements IQueryHandler<CountExportStatusesQuery> {
  constructor(
    private readonly repository: ExportStatusRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CountExportStatusesHandler.name);
  }

  async execute(query: CountExportStatusesQuery): Promise<number> {
    this.logger.info('CountExportStatusesHandler#execute.call', query.options);
    return this.repository.count(query.options);
  }
}
