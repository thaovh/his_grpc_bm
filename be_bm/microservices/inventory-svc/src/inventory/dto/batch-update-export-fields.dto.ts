export class BatchUpdateExportFieldsDto {
  readonly hisIds: number[];
  readonly exportTime?: number | null;
  readonly updatedBy?: string;
}

