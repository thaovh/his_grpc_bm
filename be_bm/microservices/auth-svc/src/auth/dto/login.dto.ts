export class LoginDto {
  readonly username: string; // username or email
  readonly password: string;
  readonly deviceId?: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
}

