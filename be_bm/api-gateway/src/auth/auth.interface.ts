import { Observable } from 'rxjs';

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  acsId: number | null;
}

export interface ExternalToken {
  tokenCode: string;
  renewCode: string;
  expireTime: string;
  loginTime: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
  externalToken?: ExternalToken;
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

export interface RenewExternalTokenRequest {
  renewCode?: string; // Optional: if not provided, will get from Redis using userId
  userId: string; // Required: user ID from JWT token
}

export interface RenewExternalTokenResponse {
  externalToken: ExternalToken;
}

export interface AuthService {
  login(data: LoginRequest): Observable<LoginResponse>;
  logout(data: LogoutRequest): Observable<{ count: number }>;
  refreshToken(data: RefreshTokenRequest): Observable<RefreshTokenResponse>;
  validateToken(data: ValidateTokenRequest): Observable<ValidateTokenResponse>;
  revokeToken(data: LogoutRequest): Observable<{ count: number }>;
  renewExternalToken(data: RenewExternalTokenRequest): Observable<RenewExternalTokenResponse>;
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

