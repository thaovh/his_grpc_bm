import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMachineUnitDto {
    @ApiProperty({ example: 'KHOA_XQ', description: 'Mã đơn vị quản lý' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ example: 'Khoa X-Quang', description: 'Tên đơn vị quản lý' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}

export class UpdateMachineUnitDto {
    @ApiPropertyOptional({ example: 'KHOA_XQ', description: 'Mã đơn vị quản lý' })
    @IsOptional()
    @IsString()
    code?: string;

    @ApiPropertyOptional({ example: 'Khoa X-Quang (Cập nhật)', description: 'Tên đơn vị quản lý' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}

export class MachineUnitResponseDto {
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

export class MachineUnitListResponseDto {
    @ApiProperty({ type: [MachineUnitResponseDto] })
    data: MachineUnitResponseDto[];
}
