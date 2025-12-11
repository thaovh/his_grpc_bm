import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateMachineDocumentTypeDto {
    @ApiProperty({ example: 'PO', description: 'Mã loại tài liệu máy' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ example: 'Đơn đặt hàng', description: 'Tên loại tài liệu máy' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;

    @ApiPropertyOptional({ example: 0, description: 'Bắt buộc nhập: 1 = Yes, 0 = No' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    isRequired?: number;
}

export class UpdateMachineDocumentTypeDto {
    @ApiPropertyOptional({ example: 'PO', description: 'Mã loại tài liệu máy' })
    @IsOptional()
    @IsString()
    code?: string;

    @ApiPropertyOptional({ example: 'Đơn đặt hàng (Cập nhật)', description: 'Tên loại tài liệu máy' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;

    @ApiPropertyOptional({ example: 1, description: 'Bắt buộc nhập: 1 = Yes, 0 = No' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    isRequired?: number;
}

export class MachineDocumentTypeResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    sortOrder: number;

    @ApiProperty()
    isRequired: number;

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
