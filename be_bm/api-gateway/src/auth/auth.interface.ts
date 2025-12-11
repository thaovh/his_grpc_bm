import { Observable } from 'rxjs';

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  acsId: number | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
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
  login(data: LoginRequest): Observable<LoginResponse>;
  logout(data: LogoutRequest): Observable<{ count: number }>;
  refreshToken(data: RefreshTokenRequest): Observable<RefreshTokenResponse>;
  validateToken(data: ValidateTokenRequest): Observable<ValidateTokenResponse>;
  revokeToken(data: LogoutRequest): Observable<{ count: number }>;
}

export interface LoginRequest {
  username: string;
  password: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface ValidateTokenRequest {
  token: string;
}

