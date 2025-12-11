import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetExportStatusByIdQuery } from '../get-export-status-by-id.query';
import { ExportStatusRepository } from '../../repositories/export-status.repository';
import { ExportStatus } from '../../entities/export-status.entity';

@QueryHandler(GetExportStatusByIdQuery)
export class GetExportStatusByIdHandler implements IQueryHandler<GetExportStatusByIdQuery> {
  constructor(
    private readonly repository: ExportStatusRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetExportStatusByIdHandler.name);
  }

  async execute(query: GetExportStatusByIdQuery): Promise<ExportStatus | null> {
    this.logger.info('GetExportStatusByIdHandler#execute.call', { id: query.id });
    return this.repository.findOne(query.id);
  }
}

