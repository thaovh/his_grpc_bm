import { Injectable, Inject, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';
import {
  AuthService as IAuthService,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  ValidateTokenRequest,
  ValidateTokenResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from './auth.interface';

@Injectable()
export class AuthService implements OnModuleInit {
  private authGrpcService: IAuthService;

  constructor(
    @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  onModuleInit() {
    this.authGrpcService = this.client.getService<IAuthService>('AuthService');
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    this.logger.info('AuthService#login.call', { username: data.username });
    const result = await firstValueFrom(this.authGrpcService.login(data)) as any;

    // Log chi tiết
    if (result.externalToken) {
      this.logger.info('AuthService#login.result.externalToken', {
        tokenCode: result.externalToken.tokenCode?.substring(0, 20) + '...',
        renewCode: result.externalToken.renewCode?.substring(0, 20) + '...',
      });
    }

    // Convert Long objects to numbers
    this.convertLongToNumber(result.user);
    this.convertLongToNumber(result, 'expiresIn');
    return result;
  }

  async logout(data: LogoutRequest): Promise<{ count: number }> {
    this.logger.info('AuthService#logout.call', { refreshToken: data.refreshToken.substring(0, 20) + '...' });
    const result = await firstValueFrom(this.authGrpcService.logout(data)) as any;
    this.logger.info('AuthService#logout.result', result);
    return result;
  }

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    this.logger.info('AuthService#refreshToken.call', { refreshToken: data.refreshToken.substring(0, 20) + '...' });
    try {
      const result = await firstValueFrom(this.authGrpcService.refreshToken(data)) as any;
      this.logger.info('AuthService#refreshToken.result', { success: true });

      // Convert Long objects to numbers
      this.convertLongToNumber(result, 'expiresIn');
      if (result.user) {
        this.convertLongToNumber(result.user);

        // Flatten roles to codes only (same as login)
        if (result.user.roles && Array.isArray(result.user.roles)) {
          result.user.roles = result.user.roles.map((role: any) =>
            typeof role === 'object' ? role.code : role
          );
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error('AuthService#refreshToken.error', {
        error: error.message,
        errorType: error.constructor?.name,
        code: error.code,
        details: error.details,
        stack: error.stack?.substring(0, 500),
      });

      // Extract clean message from gRPC error (remove "16 UNAUTHENTICATED:" prefix)
      let errorMessage = error.message || 'Invalid refresh token';
      if (errorMessage.includes(':')) {
        const parts = errorMessage.split(':');
        if (parts.length > 1) {
          // Take the part after the last colon and trim
          errorMessage = parts.slice(1).join(':').trim();
        }
      }

      // Convert gRPC errors to HTTP errors
      if (error.code === 16 || error.message?.includes('Invalid refresh token') || error.message?.includes('expired') || error.message?.includes('revoked')) {
        const httpError = new UnauthorizedException(errorMessage);
        throw httpError;
      }

      throw error;
    }
  }

  async validateToken(data: ValidateTokenRequest): Promise<ValidateTokenResponse> {
    this.logger.info('AuthService#validateToken.call', { token: data.token.substring(0, 20) + '...' });
    const result = await firstValueFrom(this.authGrpcService.validateToken(data)) as any;
    this.logger.info('AuthService#validateToken.result', { isValid: result.isValid });
    // Convert Long objects to numbers
    this.convertLongToNumber(result, 'expiresAt');
    return result;
  }

  async revokeToken(data: LogoutRequest): Promise<{ count: number }> {
    this.logger.info('AuthService#revokeToken.call', { refreshToken: data.refreshToken.substring(0, 20) + '...' });
    const result = await firstValueFrom(this.authGrpcService.revokeToken(data)) as any;
    this.logger.info('AuthService#revokeToken.result', result);
    return result;
  }

  async renewExternalToken(userId: string, renewCode?: string): Promise<{
    tokenCode: string;
    renewCode: string;
    expireTime: string;
    loginTime: string;
  }> {
    this.logger.info('AuthService#renewExternalToken.call', { userId, hasRenewCode: !!renewCode });

    try {
      const result = await firstValueFrom(
        this.authGrpcService.renewExternalToken({ userId, renewCode })
      ) as any;

      this.logger.info('AuthService#renewExternalToken.gRPCResult', {
        userId,
        hasResult: !!result,
        hasExternalToken: !!result?.externalToken,
        resultKeys: result ? Object.keys(result) : [],
      });

      if (!result || !result.externalToken) {
        this.logger.error('AuthService#renewExternalToken.invalidResult', {
          userId,
          result: JSON.stringify(result).substring(0, 500),
        });
        throw new Error('Failed to renew external token: Invalid response from auth service');
      }

      this.logger.info('AuthService#renewExternalToken.result', {
        userId,
        hasTokenCode: !!result.externalToken.tokenCode,
        hasRenewCode: !!result.externalToken.renewCode,
      });

      return result.externalToken;
    } catch (error: any) {
      this.logger.error('AuthService#renewExternalToken.error', {
        userId,
        error: error.message,
        errorType: error.constructor?.name,
        code: error.code,
        details: error.details,
        stack: error.stack?.substring(0, 500),
      });
      throw error;
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    this.logger.info('AuthService#changePassword.call', {
      userId: data.userId,
      hasDeviceId: !!data.deviceId,
    });

    try {
      const result = await firstValueFrom(
        this.authGrpcService.changePassword(data)
      ) as any;

      this.logger.info('AuthService#changePassword.result', {
        userId: data.userId,
        success: result?.success,
        hasMessage: !!result?.message,
      });

      return result;
    } catch (error: any) {
      this.logger.error('AuthService#changePassword.error', {
        userId: data.userId,
        error: error.message,
        errorType: error.constructor?.name,
        code: error.code,
        details: error.details,
        stack: error.stack?.substring(0, 500),
      });

      // Map common gRPC auth errors to HTTP 401
      if (error.code === 16 || error.message?.toLowerCase().includes('unauthorized')) {
        let errorMessage = error.message || 'Unauthorized';
        if (errorMessage.includes(':')) {
          const parts = errorMessage.split(':');
          if (parts.length > 1) {
            errorMessage = parts.slice(1).join(':').trim();
          }
        }
        throw new UnauthorizedException(errorMessage);
      }

      throw error;
    }
  }

  /**
   * Convert Long objects to numbers for Oracle/gRPC compatibility
   */
  private convertLongToNumber(obj: any, field?: string): void {
    if (!obj) return;

    // If field is specified, convert that field
    if (field) {
      if (obj[field] !== null && obj[field] !== undefined) {
        const value: number | { low: number; high: number } | null = obj[field] as any;
        if (value !== null && typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          obj[field] = longValue.low + (longValue.high * 0x100000000);
        }
      }
      return;
    }

    // Otherwise, convert acsId in user object (for backward compatibility)
    if (obj.acsId !== null && obj.acsId !== undefined) {
      const acsIdValue: number | { low: number; high: number } | null = obj.acsId as any;
      if (acsIdValue !== null && typeof acsIdValue === 'object' && 'low' in acsIdValue && 'high' in acsIdValue) {
        const longValue = acsIdValue as { low: number; high: number };
        obj.acsId = longValue.low + (longValue.high * 0x100000000);
      }
    }
  }
}

