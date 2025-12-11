import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateManufacturerCountryDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    sortOrder?: number;

    @IsNotEmpty()
    @IsString()
    createdBy: string;
}
