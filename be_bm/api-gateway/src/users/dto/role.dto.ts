import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RoleDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Role ID' })
    id: string;

    @ApiProperty({ example: 'ADMIN', description: 'Role Code (Unique)' })
    code: string;

    @ApiProperty({ example: 'Administrator', description: 'Role Name' })
    name: string;

    @ApiProperty({ example: 'System Administrator', description: 'Description', required: false })
    description?: string;
}

export class CreateRoleDto {
    @ApiProperty({ example: 'ADMIN', description: 'Role Code (Unique)', required: true })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'Administrator', description: 'Role Name', required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'System Administrator', description: 'Description', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) { }

export class AssignRoleDto {
    @ApiProperty({ example: 'ADMIN', description: 'Role Code to assign', required: true })
    @IsString()
    @IsNotEmpty()
    roleCode: string;
}

export class AssignUserRoleDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID', required: true })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: 'ADMIN', description: 'Role Code to assign', required: true })
    @IsString()
    @IsNotEmpty()
    roleCode: string;
}

export class RoleResponseDto {
    @ApiProperty({ type: RoleDto })
    data: RoleDto;
}

export class RolesResponseDto {
    @ApiProperty({ type: [RoleDto] })
    data: RoleDto[];
}
