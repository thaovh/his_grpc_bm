import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserProfileResponseDto } from '../../users/dto/user-response.dto';

export class MeProfileResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'uuid-here' })
  userId: string;

  @ApiPropertyOptional({ example: 'John' })
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Doe' })
  lastName?: string | null;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Computed field: firstName + lastName' })
  fullName?: string | null;

  @ApiPropertyOptional({ example: '+1234567890' })
  phone?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatarUrl?: string | null;

  @ApiPropertyOptional({ example: 'Software developer' })
  bio?: string | null;

  @ApiPropertyOptional({ example: '1990-01-01' })
  dateOfBirth?: Date | null;

  @ApiPropertyOptional({ example: '123 Main St, City, Country' })
  address?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class MeResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiPropertyOptional({ example: 1001 })
  acsId?: number | null;

  @ApiPropertyOptional({ type: MeProfileResponseDto })
  profile?: MeProfileResponseDto | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isActive: number;

  // Exclude passwordHash from response
  @Exclude()
  passwordHash?: string;

  // Exclude version from response (internal field)
  @Exclude()
  version?: number;
}

