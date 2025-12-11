import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateUnitOfMeasureDto {
  @ApiProperty({ example: 'KG', description: 'Mã đơn vị tính' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Kilogram', description: 'Tên đơn vị tính' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

