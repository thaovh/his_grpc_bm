import { CreateExportStatusHandler } from './create-export-status.handler';
import { UpdateExportStatusHandler } from './update-export-status.handler';
import { GetExportStatusesHandler } from '../../queries/handlers/get-export-statuses.handler';
import { GetExportStatusByIdHandler } from '../../queries/handlers/get-export-status-by-id.handler';
import { GetExportStatusByCodeHandler } from '../../queries/handlers/get-export-status-by-code.handler';
import { CountExportStatusesHandler } from '../../queries/handlers/count-export-statuses.handler';

export const ExportStatusHandlers = [
    CreateExportStatusHandler,
    UpdateExportStatusHandler,
    GetExportStatusesHandler,
    GetExportStatusByIdHandler,
    GetExportStatusByCodeHandler,
    CountExportStatusesHandler,
];
