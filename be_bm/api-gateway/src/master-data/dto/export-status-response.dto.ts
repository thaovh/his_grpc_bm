import { ApiProperty } from '@nestjs/swagger';

export class ExportStatusResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'PENDING' })
  code: string;

  @ApiProperty({ example: 'Chờ xử lý' })
  name: string;

  @ApiProperty({ example: 1 })
  sortOrder: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ required: false })
  createdBy?: string;

  @ApiProperty({ required: false })
  updatedBy?: string;

  @ApiProperty()
  version: number;

  @ApiProperty()
  isActive: number;
}

