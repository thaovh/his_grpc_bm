import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HisProvider } from '../../providers/his.provider';
import { RedisService } from '../redis.service';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly hisProvider: HisProvider,
    private readonly redisService: RedisService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthTokenService.name);
  }

  /**
   * Get token from Redis
   */
  async getToken(userId: string): Promise<{
    found: boolean;
    tokenCode?: string;
    renewCode?: string;
    expireTime?: string;
    loginTime?: string;
  }> {
    this.logger.info('AuthTokenService#getToken.call', { userId });

    const tokenData = await this.redisService.getExternalToken(userId);

    if (!tokenData) {
      return { found: false };
    }

    return {
      found: true,
      tokenCode: tokenData.tokenCode,
      renewCode: tokenData.renewCode,
      expireTime: tokenData.expireTime,
      loginTime: tokenData.loginTime,
    };
  }

  /**
   * Invalidate token in Redis
   */
  async invalidateToken(userId: string): Promise<number> {
    this.logger.info('AuthTokenService#invalidateToken.call', { userId });

    await this.redisService.deleteExternalToken(userId);

    return 1; // Return count of deleted tokens
  }

  /**
   * Renew token from HIS system
   */
  async renewToken(renewCode: string, userId?: string): Promise<{
    success: boolean;
    message?: string;
    tokenCode?: string;
    renewCode?: string;
    loginTime?: string;
    expireTime?: string;
    validAddress?: string;
    loginAddress?: string;
    versionApp?: string;
    machineName?: string;
    lastAccessTime?: string;
  }> {
    this.logger.info('AuthTokenService#renewToken.call', { 
      userId,
      renewCodePrefix: renewCode?.substring(0, 20) + '...',
    });

    try {
      // 1. Call HIS API to renew token
      const hisResponse = await this.hisProvider.renewToken(renewCode);

      // Check Success field from HIS API response
      if (!hisResponse.Success || !hisResponse.Data) {
        this.logger.warn('AuthTokenService#renewToken.failed', {
          Success: hisResponse.Success,
          hasData: !!hisResponse.Data,
        });
        return {
          success: false,
          message: 'Token renewal failed',
        };
      }

      // 2. Update token in Redis if userId is provided
      if (userId && hisResponse.Data.TokenCode && hisResponse.Data.RenewCode) {
        try {
          await this.redisService.setExternalToken(userId, {
            tokenCode: hisResponse.Data.TokenCode,
            renewCode: hisResponse.Data.RenewCode,
            expireTime: hisResponse.Data.ExpireTime,
            loginTime: hisResponse.Data.LoginTime,
          });
          this.logger.info('AuthTokenService#renewToken.tokenUpdated', {
            userId,
          });
        } catch (redisError: any) {
          this.logger.error('AuthTokenService#renewToken.redisError', {
            userId,
            error: redisError.message,
          });
          // Continue even if Redis fails - token is still in response
        }
      }

      // 3. Transform response
      return {
        success: true,
        message: 'Token renewed successfully',
        tokenCode: hisResponse.Data.TokenCode,
        renewCode: hisResponse.Data.RenewCode,
        loginTime: hisResponse.Data.LoginTime,
        expireTime: hisResponse.Data.ExpireTime,
        validAddress: hisResponse.Data.ValidAddress,
        loginAddress: hisResponse.Data.LoginAddress,
        versionApp: hisResponse.Data.VersionApp,
        machineName: hisResponse.Data.MachineName,
        lastAccessTime: hisResponse.Data.LastAccessTime,
      };
    } catch (error: any) {
      this.logger.error('AuthTokenService#renewToken.error', {
        userId,
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      
      return {
        success: false,
        message: error.message || 'Token renewal failed',
      };
    }
  }

  /**
   * Get any available external token from Redis
   * Used when we need a token but don't have a specific userId
   */
  async getAnyExternalToken(): Promise<{
    tokenCode?: string;
    renewCode?: string;
    expireTime?: string;
    loginTime?: string;
  } | null> {
    try {
      const keys = await this.redisService.scanKeys('external_token:*');
      if (!keys || keys.length === 0) {
        return null;
      }
      const tokenData = await this.redisService.getExternalTokenByKey(keys[0]);
      return tokenData;
    } catch (error: any) {
      this.logger.error('AuthTokenService#getAnyExternalToken.error', {
        error: error.message,
      });
      return null;
    }
  }
}

