import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, MaxLength } from 'class-validator';

export class UpdateApiEndpointDto {
    @IsString()
    @IsOptional()
    @MaxLength(1000)
    description?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    module?: string;

    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    roleCodes?: string[];

    @IsNumber()
    @IsOptional()
    rateLimitRequests?: number;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    rateLimitWindow?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    resourceName?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    action?: string;

    @IsString()
    @IsOptional()
    updatedBy?: string;
}
