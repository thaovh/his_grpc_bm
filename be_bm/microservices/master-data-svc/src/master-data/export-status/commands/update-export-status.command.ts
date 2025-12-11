import { UpdateExportStatusDto } from '../dto/update-export-status.dto';

export class UpdateExportStatusCommand {
  constructor(
    public readonly id: string,
    public readonly ExportStatusDto: UpdateExportStatusDto,
  ) {}
}

