import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateTransferDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    machineId: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fromBranchId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    toBranchId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fromDepartmentId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    toDepartmentId?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    transferDate?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    statusId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    reason?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    referenceNumber?: string;
}

export class UpdateTransferDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    statusId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    reason?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    referenceNumber?: string;
}

export class TransferResponseDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    machineId: string;
    @ApiProperty()
    fromBranchId: string;
    @ApiProperty()
    toBranchId: string;
    @ApiProperty()
    fromDepartmentId: string;
    @ApiProperty()
    toDepartmentId: string;
    @ApiProperty()
    transferDate: string;
    @ApiProperty()
    statusId: string;
    @ApiProperty()
    transferTypeId: string;
    @ApiProperty()
    reason: string;
    @ApiProperty()
    referenceNumber: string;
    @ApiProperty()
    createdAt: string;
    @ApiProperty()
    updatedAt: string;
    @ApiProperty()
    version: number;
    @ApiProperty()
    isActive: number;
}

export class TransferListResponseDto {
    @ApiProperty({ type: [TransferResponseDto] })
    data: TransferResponseDto[];
}
