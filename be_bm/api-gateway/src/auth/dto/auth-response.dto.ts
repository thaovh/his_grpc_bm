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

export class ExternalTokenDto {
  @ApiProperty({ example: 'bccf78ddc2dc72a5cb7a6c2c210ad1e70...' })
  tokenCode: string;

  @ApiProperty({ example: '6ea0c2dbeb82ee93bfa8eaf932dda5744...' })
  renewCode: string;

  @ApiProperty({ example: '2026-01-10T10:46:37.1942293+07:00' })
  expireTime: string;

  @ApiProperty({ example: '2025-12-11T10:46:37.1942293+07:00' })
  loginTime: string;
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

  @ApiPropertyOptional({ type: ExternalTokenDto, description: 'External token from HIS (if user is from external system)' })
  externalToken?: ExternalTokenDto;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'new-refresh-token-here' })
  refreshToken: string;

  @ApiProperty({ example: 900, description: 'Expires in seconds' })
  expiresIn: number;
}

