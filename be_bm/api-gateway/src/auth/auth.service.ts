import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
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
    const result = await firstValueFrom(this.authGrpcService.refreshToken(data)) as any;
    this.logger.info('AuthService#refreshToken.result', { success: true });
    // Convert Long objects to numbers
    this.convertLongToNumber(result, 'expiresIn');
    return result;
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

