import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTransferStatusDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    sortOrder?: number;
}

export class UpdateTransferStatusDto extends CreateTransferStatusDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class TransferStatusResponseDto extends UpdateTransferStatusDto {
    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty()
    version: number;

    @ApiProperty()
    isActive: number;
}
