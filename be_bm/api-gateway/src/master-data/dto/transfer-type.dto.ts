import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTransferTypeDto {
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

export class UpdateTransferTypeDto extends CreateTransferTypeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class TransferTypeResponseDto extends UpdateTransferTypeDto {
    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty()
    version: number;

    @ApiProperty()
    isActive: number;
}
