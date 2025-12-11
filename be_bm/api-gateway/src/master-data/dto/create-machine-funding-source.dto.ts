import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateMachineFundingSourceDto {
    @ApiProperty({ example: 'NSNN', description: 'Mã nguồn kinh phí máy' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'Ngân sách nhà nước', description: 'Tên nguồn kinh phí máy' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 1, description: 'Thứ tự sắp xếp' })
    @IsNumber()
    @IsOptional()
    sortOrder: number;

    createdBy?: string;
}
