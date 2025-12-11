export class CreateUserProfileDto {
  readonly userId: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly avatarUrl?: string;
  readonly bio?: string;
  readonly dateOfBirth?: Date;
  readonly address?: string;
}

