import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class RenewExternalTokenDto {
  @ApiPropertyOptional({
    example: '6f3eef7c4e9a7aaff38524ecc49fef0fcf9329ee8287745840ed47a2dda226076f3eef7c4e9a7aaff38524ecc49fef0fcf9329ee8287745840ed47a2dda22607',
    description: 'Renew code from previous login. If not provided, will be retrieved from Redis using userId from JWT token.',
  })
  @IsString()
  @IsOptional()
  readonly renewCode?: string;
}

export class RenewExternalTokenResponseDto {
  @ApiProperty({
    example: '65f82795b10eb78f95515780f2fa92c98a2ec4cc548848f59965112441ac8c08',
    description: 'New token code from HIS system',
  })
  tokenCode: string;

  @ApiProperty({
    example: '9e7f344c12f1358590850f34545ec692efbcc3fba602d9a9ef133318317875ef9e7f344c12f1358590850f34545ec692efbcc3fba602d9a9ef133318317875ef',
    description: 'New renew code for future renewals',
  })
  renewCode: string;

  @ApiProperty({
    example: '2026-01-10T15:10:08.3356881+07:00',
    description: 'Token expiration time',
  })
  expireTime: string;

  @ApiProperty({
    example: '2025-12-11T15:10:08.3356881+07:00',
    description: 'Token login time',
  })
  loginTime: string;
}

