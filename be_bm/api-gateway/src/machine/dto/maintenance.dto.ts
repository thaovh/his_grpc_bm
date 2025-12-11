import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateMaintenanceRecordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    machineId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    maintenanceTypeId: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    performer?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    cost?: number;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    nextMaintenanceDate?: string;
}

export class UpdateMaintenanceRecordDto extends CreateMaintenanceRecordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class MaintenanceRecordResponseDto extends UpdateMaintenanceRecordDto {
    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty()
    version: number;

    @ApiProperty()
    isActive: number;
}

export class MaintenanceRecordListResponseDto {
    @ApiProperty({ type: [MaintenanceRecordResponseDto] })
    data: MaintenanceRecordResponseDto[];
}
