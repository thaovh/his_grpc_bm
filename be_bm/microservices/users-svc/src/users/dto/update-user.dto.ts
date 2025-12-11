import { IsOptional, IsEmail, IsNumber } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  @IsOptional()
  readonly email?: string;

  @IsOptional()
  @IsNumber()
  readonly acsId?: number | null;
}

