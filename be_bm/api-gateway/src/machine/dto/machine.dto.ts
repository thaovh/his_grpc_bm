import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateMachineDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    statusId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    unitId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    vendorId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    manufacturerCountryId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    manufacturerId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fundingSourceId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    serialNumber?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    model?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    manufacturingYear?: number;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    purchaseDate?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    warrantyExpirationDate?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    branchId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    departmentId?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    managementDepartmentId?: string;

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    transferDate?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    transferTypeId?: string;
}

export class UpdateMachineDto extends PartialType(CreateMachineDto) {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    id?: string;
}

export class MachineResponseDto extends UpdateMachineDto {
    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty()
    version: number;

    @ApiProperty()
    isActive: number;

    @ApiProperty({ required: false })
    category?: { id: string, name: string };

    @ApiProperty({ required: false })
    status?: { id: string, name: string };

    @ApiProperty({ required: false })
    unit?: { id: string, name: string };

    @ApiProperty({ required: false })
    vendor?: { id: string, name: string };

    @ApiProperty({ required: false })
    manufacturerCountry?: { id: string, name: string };

    @ApiProperty({ required: false })
    fundingSource?: { id: string, name: string };

    @ApiProperty({ required: false })
    branch?: { id: string, name: string };

    @ApiProperty({ required: false })
    department?: { id: string, name: string };

    @ApiProperty({ required: false })
    managementDepartmentId?: string; // Returning the ID primarily

    @ApiProperty({ required: false })
    manufacturer?: { id: string, name: string };

    @ApiProperty({ type: () => [MachineDocumentResponseDto], required: false })
    documents?: MachineDocumentResponseDto[];
}

import { MachineDocumentResponseDto } from './document.dto';

export class MachineListResponseDto {
    @ApiProperty({ type: [MachineResponseDto] })
    data: MachineResponseDto[];
}
