export class BatchUpdateActualExportFieldsDto {
  readonly hisIds: number[];
  readonly actualExportTime?: number | null;
  readonly updatedBy?: string;
}

