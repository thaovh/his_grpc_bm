import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMachineStatusDto {
    @ApiProperty({ example: 'HOATDONG', description: 'Mã trạng thái' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ example: 'Đang hoạt động', description: 'Tên trạng thái' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}

export class UpdateMachineStatusDto {
    @ApiPropertyOptional({ example: 'HOATDONG', description: 'Mã trạng thái' })
    @IsOptional()
    @IsString()
    code?: string;

    @ApiPropertyOptional({ example: 'Đang hoạt động (Cập nhật)', description: 'Tên trạng thái' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}

export class MachineStatusResponseDto {
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

export class MachineStatusListResponseDto {
    @ApiProperty({ type: [MachineStatusResponseDto] })
    data: MachineStatusResponseDto[];
}
