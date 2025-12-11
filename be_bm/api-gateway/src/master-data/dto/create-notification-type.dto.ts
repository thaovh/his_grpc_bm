
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateNotificationTypeDto {
    @ApiProperty({ example: 'NOTIFY_001', description: 'Mã loại thông báo' })
    @IsString()
    code: string;

    @ApiProperty({ example: 'Thông báo chấm công', description: 'Tên loại thông báo' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'Thông báo khi nhân viên chấm công thành công', description: 'Mô tả' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}
