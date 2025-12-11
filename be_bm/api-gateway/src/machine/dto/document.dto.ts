import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMachineDocumentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    machineId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fileUrl: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateMachineDocumentDto extends CreateMachineDocumentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class MachineDocumentResponseDto extends UpdateMachineDocumentDto {
    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty()
    version: number;

    @ApiProperty()
    isActive: number;
}

export class MachineDocumentListResponseDto {
    @ApiProperty({ type: [MachineDocumentResponseDto] })
    data: MachineDocumentResponseDto[];
}
