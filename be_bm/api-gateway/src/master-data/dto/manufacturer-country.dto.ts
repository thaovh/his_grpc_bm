import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateManufacturerCountryDto {
    @ApiProperty({ example: 'VN', description: 'Mã nước sản xuất' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ example: 'Việt Nam', description: 'Tên nước sản xuất' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}

export class UpdateManufacturerCountryDto {
    @ApiPropertyOptional({ example: 'VN', description: 'Mã nước sản xuất' })
    @IsOptional()
    @IsString()
    code?: string;

    @ApiPropertyOptional({ example: 'Việt Nam', description: 'Tên nước sản xuất' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}

export class ManufacturerCountryResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    sortOrder: number;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    updatedBy: string;

    @ApiProperty()
    isActive: number;

    @ApiProperty()
    version: number;
}
