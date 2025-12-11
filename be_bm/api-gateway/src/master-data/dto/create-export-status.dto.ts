import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateExportStatusDto {
  @ApiProperty({ example: 'PENDING', description: 'Mã loại trạng thái' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Chờ xử lý', description: 'Tên loại trạng thái' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

