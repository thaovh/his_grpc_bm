import { FindManyOptions } from 'typeorm';
import { ExportStatus } from '../entities/export-status.entity';

export class GetExportStatusesQuery {
  constructor(public readonly options?: FindManyOptions<ExportStatus>) {}
}
