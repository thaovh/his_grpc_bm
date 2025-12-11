import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsNumber, IsInt } from 'class-validator';

export class CreateManufacturerDto {
    @ApiProperty({ example: 'MFG001', description: 'Manufacturer code' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    code: string;

    @ApiProperty({ example: 'Samsung', description: 'Manufacturer name' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({ example: 1, description: 'Sort order', required: false })
    @IsNumber()
    @IsInt()
    @IsOptional()
    sortOrder?: number;
}

export class UpdateManufacturerDto {
    @ApiProperty({ example: 'MFG001', description: 'Manufacturer code', required: false })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    code?: string;

    @ApiProperty({ example: 'Samsung', description: 'Manufacturer name', required: false })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    @ApiProperty({ example: 1, description: 'Sort order', required: false })
    @IsNumber()
    @IsInt()
    @IsOptional()
    sortOrder?: number;
}

export class ManufacturerResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    sortOrder: number;

    @ApiProperty()
    isActive: number;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    updatedBy: string;
}
