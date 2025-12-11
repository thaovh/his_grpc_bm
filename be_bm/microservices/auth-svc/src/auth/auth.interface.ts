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
  accessToken: string;        // JWT token local
  refreshToken: string;       // JWT refresh token local
  expiresIn: number;          // seconds
  user: UserInfo;
  externalToken?: {           // Token từ HIS (nếu có)
    tokenCode: string;
    renewCode: string;
    expireTime: string;
    loginTime: string;
  };
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

export interface RenewExternalTokenResponse {
  tokenCode: string;
  renewCode: string;
  expireTime: string;
  loginTime: string;
}

export interface AuthService {
  login(loginDto: LoginDto): Promise<LoginResponse>;
  logout(logoutDto: LogoutDto): Promise<number>;
  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse>;
  validateToken(token: string): Promise<ValidateTokenResponse>;
  revokeToken(logoutDto: LogoutDto): Promise<number>;
  renewExternalToken(userId: string, renewCode?: string): Promise<RenewExternalTokenResponse>;
}

