import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsInt, IsNumber } from 'class-validator';

export class CreateDepartmentDto {
    @ApiProperty({ description: 'Mã khoa phòng', example: 'KHT' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ description: 'Tên khoa phòng', example: 'Khoa Ngoại' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'ID khoa phòng cha', example: 'uuid', required: false })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiProperty({ description: 'ID chi nhánh', example: 'uuid' })
    @IsNotEmpty()
    @IsUUID()
    branchId: string;

    @ApiProperty({ description: 'ID loại khoa phòng', example: 'uuid' })
    @IsNotEmpty()
    @IsUUID()
    departmentTypeId: string;

    @ApiProperty({ description: 'ID khoa phòng trên HIS', example: 123456, required: false })
    @IsOptional()
    @IsNumber()
    hisId?: number;

    @ApiProperty({ description: 'Là khoa quản lý tài sản', example: 1, required: false, default: 0 })
    @IsOptional()
    @IsInt()
    isAssetManagement?: number;
}
