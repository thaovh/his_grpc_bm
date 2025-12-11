import { CreateExportStatusDto } from '../dto/create-export-status.dto';

export class CreateExportStatusCommand {
  constructor(public readonly ExportStatusDto: CreateExportStatusDto) {}
}

