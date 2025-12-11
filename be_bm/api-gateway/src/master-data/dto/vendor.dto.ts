import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateVendorDto {
    @ApiProperty({ example: 'VENDOR01', description: 'Mã nhà cung cấp' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ example: 'Công ty TNHH Thiết bị Y tế A', description: 'Tên nhà cung cấp' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: '123 Đường ABC, Quận 1, TP.HCM', description: 'Địa chỉ' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: '0123456789', description: 'Số điện thoại' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: 'vendor@example.com', description: 'Email' })
    @IsOptional()
    @IsEmail()
    email?: string;
}

export class UpdateVendorDto {
    @ApiPropertyOptional({ example: 'VENDOR01', description: 'Mã nhà cung cấp' })
    @IsOptional()
    @IsString()
    code?: string;

    @ApiPropertyOptional({ example: 'Công ty TNHH Thiết bị Y tế A (Cập nhật)', description: 'Tên nhà cung cấp' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: '123 Đường ABC, Quận 1, TP.HCM', description: 'Địa chỉ' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: '0123456789', description: 'Số điện thoại' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: 'vendor@example.com', description: 'Email' })
    @IsOptional()
    @IsEmail()
    email?: string;
}

export class VendorResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    updatedBy: string;

    @ApiProperty()
    isActive: number;

    @ApiProperty()
    version: number;
}

export class VendorListResponseDto {
    @ApiProperty({ type: [VendorResponseDto] })
    data: VendorResponseDto[];
}
