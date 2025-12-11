import { IsOptional, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  @MinLength(1)
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}


