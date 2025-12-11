import { FindManyOptions } from 'typeorm';
import { ExportStatus } from '../entities/export-status.entity';

export class CountExportStatusesQuery {
  constructor(public readonly options?: FindManyOptions<ExportStatus>) {}
}
