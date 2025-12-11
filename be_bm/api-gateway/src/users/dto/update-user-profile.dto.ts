import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  readonly avatarUrl?: string;

  @ApiPropertyOptional({ example: 'Software developer' })
  @IsOptional()
  @IsString()
  readonly bio?: string;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  readonly dateOfBirth?: string;

  @ApiPropertyOptional({ example: '123 Main St, City, Country' })
  @IsOptional()
  @IsString()
  readonly address?: string;
}

