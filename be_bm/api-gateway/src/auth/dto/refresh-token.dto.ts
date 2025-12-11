import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh-token-here', description: 'Refresh token' })
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string;
}

