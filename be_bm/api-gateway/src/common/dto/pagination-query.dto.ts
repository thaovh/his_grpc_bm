import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 25, default: 25, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 25;

  @ApiPropertyOptional({ example: 'search term' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: '-createdAt,name', description: 'Comma-separated fields. Prefix with - for DESC' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({ example: 'id,name,createdAt', description: 'Comma-separated field names' })
  @IsOptional()
  @IsString()
  select?: string;
}

