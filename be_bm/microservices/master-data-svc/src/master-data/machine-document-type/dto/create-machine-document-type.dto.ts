import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateMachineDocumentTypeDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    sortOrder?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    isRequired?: number;

    @IsNotEmpty()
    @IsString()
    createdBy: string;
}
