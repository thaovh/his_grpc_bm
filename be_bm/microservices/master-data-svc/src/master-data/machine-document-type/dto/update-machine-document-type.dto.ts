import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class UpdateMachineDocumentTypeDto {
    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    sortOrder?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    isRequired?: number;

    @IsOptional()
    @IsString()
    updatedBy?: string;
}
