import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 25 })
  limit: number;

  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 4 })
  totalPages: number;

  @ApiProperty({ example: false })
  hasPrevious: boolean;

  @ApiProperty({ example: true })
  hasNext: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  meta: PaginationMetaDto;
}

