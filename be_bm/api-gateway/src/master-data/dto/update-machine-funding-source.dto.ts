import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateMachineFundingSourceDto {
    @ApiPropertyOptional({ example: 'NSNN', description: 'Mã nguồn kinh phí máy' })
    @IsString()
    @IsOptional()
    code?: string;

    @ApiPropertyOptional({ example: 'Ngân sách nhà nước', description: 'Tên nguồn kinh phí máy' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsNumber()
    @IsOptional()
    sortOrder?: number;

    updatedBy?: string;
}
