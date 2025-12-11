import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEmail, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Exclude password from update (should have separate endpoint for password change)
  readonly password?: never;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({ example: 1001 })
  @IsOptional()
  @IsNumber()
  readonly acsId?: number | null;
}

