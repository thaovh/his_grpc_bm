import { IsString, IsNotEmpty, IsOptional, MaxLength, IsNumber } from 'class-validator';

export class CreateManufacturerDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    code: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsNumber()
    @IsOptional()
    sortOrder?: number;

    @IsString()
    @IsOptional()
    createdBy?: string;
}
