import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiPropertyOptional({ example: 1001 })
  acsId?: number | null;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'refresh-token-here' })
  refreshToken: string;

  @ApiProperty({ example: 900, description: 'Expires in seconds' })
  expiresIn: number;

  @ApiProperty({ type: UserInfoDto })
  user: UserInfoDto;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'new-refresh-token-here' })
  refreshToken: string;

  @ApiProperty({ example: 900, description: 'Expires in seconds' })
  expiresIn: number;
}

