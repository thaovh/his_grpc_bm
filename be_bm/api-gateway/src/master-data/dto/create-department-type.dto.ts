import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentTypeDto {
    @ApiProperty({ description: 'Mã loại khoa phòng', example: 'LM' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ description: 'Tên loại khoa phòng', example: 'Lâm sàng' })
    @IsNotEmpty()
    @IsString()
    name: string;
}
