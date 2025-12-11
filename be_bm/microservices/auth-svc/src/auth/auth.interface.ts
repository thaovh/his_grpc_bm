import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  acsId: number | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  user: UserInfo;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ValidateTokenResponse {
  isValid: boolean;
  userId: string;
  expiresAt: number;
}

export interface AuthService {
  login(loginDto: LoginDto): Promise<LoginResponse>;
  logout(logoutDto: LogoutDto): Promise<number>;
  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse>;
  validateToken(token: string): Promise<ValidateTokenResponse>;
  revokeToken(logoutDto: LogoutDto): Promise<number>;
}

