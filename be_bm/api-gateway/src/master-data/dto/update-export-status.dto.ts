import { PartialType } from '@nestjs/swagger';
import { CreateExportStatusDto } from './create-export-status.dto';

export class UpdateExportStatusDto extends PartialType(CreateExportStatusDto) {}

