import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMachineCategoryDto {
    @ApiProperty({ example: 'XQUANG', description: 'Mã loại máy' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ example: 'Máy X-Quang', description: 'Tên loại máy' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}

export class UpdateMachineCategoryDto {
    @ApiPropertyOptional({ example: 'XQUANG', description: 'Mã loại máy' })
    @IsOptional()
    @IsString()
    code?: string;

    @ApiPropertyOptional({ example: 'Máy X-Quang (Cập nhật)', description: 'Tên loại máy' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}

export class MachineCategoryResponseDto {
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

export class MachineCategoryListResponseDto {
    @ApiProperty({ type: [MachineCategoryResponseDto] })
    data: MachineCategoryResponseDto[];
}
