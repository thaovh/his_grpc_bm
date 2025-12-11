import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'old-password' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'new-strong-password' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}


