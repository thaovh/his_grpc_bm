import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateBranchDto {
    @ApiProperty({ description: 'Mã chi nhánh', example: 'CN01' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ description: 'Tên chi nhánh', example: 'Chi nhánh 1' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Địa chỉ', example: 'Số 1 Trần Hưng Đạo', required: false })
    @IsOptional()
    @IsString()
    address?: string;
}
