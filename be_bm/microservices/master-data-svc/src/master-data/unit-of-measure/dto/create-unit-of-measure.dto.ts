export class CreateUnitOfMeasureDto {
  readonly code: string;
  readonly name: string;
  readonly sortOrder?: number | null;
  readonly createdBy?: string | null;
}

