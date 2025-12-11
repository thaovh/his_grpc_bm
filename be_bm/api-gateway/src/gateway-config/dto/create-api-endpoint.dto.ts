import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApiEndpointDto {
    @ApiProperty({ example: '/api/v1/users' })
    @IsString()
    @IsNotEmpty()
    path: string;

    @ApiProperty({ example: 'GET', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] })
    @IsString()
    @IsNotEmpty()
    method: string;

    @ApiPropertyOptional({ example: 'Get user list' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: 'Users' })
    @IsString()
    @IsOptional()
    module?: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;

    @ApiPropertyOptional({ example: ['ADMIN', 'USER'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    roleCodes?: string[];

    @ApiPropertyOptional({ example: 60 })
    @IsInt()
    @Min(1)
    @IsOptional()
    rateLimitRequests?: number;

    @ApiPropertyOptional({ example: 'minute', enum: ['second', 'minute', 'hour', 'day'] })
    @IsString()
    @IsOptional()
    rateLimitWindow?: string;

    @ApiPropertyOptional({ example: 'users', description: 'Resource name for resource-based authorization' })
    @IsString()
    @IsOptional()
    resourceName?: string;

    @ApiPropertyOptional({ example: 'list', description: 'Action name for resource-based authorization' })
    @IsString()
    @IsOptional()
    action?: string;
}
