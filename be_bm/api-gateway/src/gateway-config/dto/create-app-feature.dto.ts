import { IsString, IsOptional, IsNumber, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppFeatureDto {
    @ApiProperty({
        description: 'Mã tính năng (unique)',
        example: 'inventory'
    })
    @IsString()
    code: string;

    @ApiProperty({
        description: 'Tên hiển thị',
        example: 'Quản lý kho'
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Icon name',
        example: 'warehouse'
    })
    @IsString()
    @IsOptional()
    icon?: string;

    @ApiPropertyOptional({
        description: 'Route trong app',
        example: '/inventory'
    })
    @IsString()
    @IsOptional()
    route?: string;

    @ApiPropertyOptional({
        description: 'ID của feature cha (cho menu đa cấp)',
        example: 'abc-123-def-456'
    })
    @IsString()
    @IsOptional()
    parentId?: string;

    @ApiPropertyOptional({
        description: 'Thứ tự hiển thị',
        example: 1,
        default: 0
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    orderIndex?: number;

    @ApiPropertyOptional({
        description: 'Danh sách role codes có quyền truy cập',
        example: ['ADMIN', 'MANAGER'],
        type: [String]
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    roleCodes?: string[];

    @ApiPropertyOptional({
        description: 'ID người tạo',
        example: 'user-uuid'
    })
    @IsString()
    @IsOptional()
    createdBy?: string;
}
