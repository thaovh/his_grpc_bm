import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMaintenanceTypeDto {
    @ApiProperty({ example: 'DINHKY', description: 'Mã loại bảo trì' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ example: 'Bảo trì định kỳ', description: 'Tên loại bảo trì' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}

export class UpdateMaintenanceTypeDto {
    @ApiPropertyOptional({ example: 'DINHKY', description: 'Mã loại bảo trì' })
    @IsOptional()
    @IsString()
    code?: string;

    @ApiPropertyOptional({ example: 'Bảo trì định kỳ (Cập nhật)', description: 'Tên loại bảo trì' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}

export class MaintenanceTypeResponseDto {
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

export class MaintenanceTypeListResponseDto {
    @ApiProperty({ type: [MaintenanceTypeResponseDto] })
    data: MaintenanceTypeResponseDto[];
}
