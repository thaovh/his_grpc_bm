export class CreateUserDto {
  readonly id?: string;
  readonly username: string;
  readonly email: string;
  readonly password: string; // Will be hashed before saving
  readonly acsId?: number | null;
  
  // Profile fields (optional on create)
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly avatarUrl?: string;
  readonly bio?: string;
  readonly dateOfBirth?: Date;
  readonly address?: string;
}

