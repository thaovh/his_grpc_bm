import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', description: 'Username for login' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  readonly username: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address for login' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'password123', description: 'Password (will be hashed)', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @ApiPropertyOptional({ example: 1001, description: 'ACS System ID' })
  @IsOptional()
  @IsNumber()
  readonly acsId?: number | null;

  // Profile fields (optional on create)
  @ApiPropertyOptional({ example: 'John', description: 'First name' })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Last name' })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  readonly phone?: string;
}

