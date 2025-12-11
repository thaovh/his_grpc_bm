import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateManufacturerCountryDto {
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
    @IsString()
    updatedBy?: string;
}
