import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'johndoe', description: 'Username or email' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'device-123', required: false, description: 'Device identifier' })
  @IsString()
  @IsOptional()
  readonly deviceId?: string;

  @ApiProperty({ example: '192.168.1.1', required: false, description: 'IP address' })
  @IsString()
  @IsOptional()
  readonly ipAddress?: string;

  @ApiProperty({ example: 'Mozilla/5.0...', required: false, description: 'User agent' })
  @IsString()
  @IsOptional()
  readonly userAgent?: string;
}

