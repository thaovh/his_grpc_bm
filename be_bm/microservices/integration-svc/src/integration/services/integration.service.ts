import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HisProvider, HisLoginRequest, HisLoginResponse, HisUserInfo } from '../providers/his.provider';
import { RedisService } from './redis.service';
import { UserSyncService } from './user-sync.service';
import { IntegrationService as IIntegrationService } from '../integration.interface';

@Injectable()
export class IntegrationServiceImpl implements IIntegrationService {
  constructor(
    private readonly hisProvider: HisProvider,
    private readonly redisService: RedisService,
    private readonly userSyncService: UserSyncService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IntegrationServiceImpl.name);
  }

  /**
   * Login to HIS system and sync user if needed
   */
  async hisLogin(request: HisLoginRequest): Promise<HisLoginResponse> {
    this.logger.info('IntegrationService#hisLogin.call', { username: request.username });

    try {
      // 1. Call HIS API to authenticate
      const hisResponse = await this.hisProvider.login(request);

      // hisResponse từ HIS API có format: { Success: true, Data: { ... }, Param: null }
      // Check Success field (uppercase) from HIS API response
      if (!hisResponse.Success || !hisResponse.Data) {
        this.logger.warn('IntegrationService#hisLogin.failed', {
          username: request.username,
          Success: hisResponse.Success,
          hasData: !!hisResponse.Data,
          response: JSON.stringify(hisResponse).substring(0, 500),
        });
        return {
          success: false, // Proto expects lowercase
          Success: false, // For compatibility
          message: 'HIS authentication failed',
          Param: null,
        } as HisLoginResponse;
      }

    // 2. Sync user to local database
    let syncResult;
    try {
      // Transform HIS User format to HisUserInfo format
      const hisUserInfo: HisUserInfo = {
        loginName: hisResponse.Data.User.LoginName,
        userName: hisResponse.Data.User.UserName,
        applicationCode: hisResponse.Data.User.ApplicationCode,
        gCode: hisResponse.Data.User.GCode,
        email: hisResponse.Data.User.Email,
        mobile: hisResponse.Data.User.Mobile,
        roles: hisResponse.Data.RoleDatas?.map(role => ({
          roleCode: role.RoleCode,
          roleName: role.RoleName,
        })),
      };
      syncResult = await this.userSyncService.syncUser(hisUserInfo);
      this.logger.info('IntegrationService#hisLogin.userSynced', {
        userId: syncResult.userId,
        created: syncResult.created,
      });
    } catch (syncError: any) {
      this.logger.error('IntegrationService#hisLogin.syncError', {
        username: request.username,
        error: syncError.message,
      });
      // Continue even if sync fails - user can still login
    }

    // 3. Store token in Redis if user was synced
    if (syncResult?.userId) {
      try {
        await this.redisService.setExternalToken(syncResult.userId, {
          tokenCode: hisResponse.Data.TokenCode,
          renewCode: hisResponse.Data.RenewCode,
          expireTime: hisResponse.Data.ExpireTime,
          loginTime: hisResponse.Data.LoginTime,
        });
        this.logger.info('IntegrationService#hisLogin.tokenStored', {
          userId: syncResult.userId,
        });
      } catch (redisError: any) {
        this.logger.error('IntegrationService#hisLogin.redisError', {
          userId: syncResult.userId,
          error: redisError.message,
        });
        // Continue even if Redis fails - token is still in response
      }
    }

    // 4. Transform response to match proto definition
    // Proto expects: success (lowercase), but we also set Success for compatibility
    const response: HisLoginResponse = {
      Success: true, // For compatibility with interface
      success: true, // For proto (lowercase)
      message: 'Login successful',
      tokenCode: hisResponse.Data.TokenCode,
      renewCode: hisResponse.Data.RenewCode,
      loginTime: hisResponse.Data.LoginTime,
      expireTime: hisResponse.Data.ExpireTime,
      validAddress: hisResponse.Data.ValidAddress,
      loginAddress: hisResponse.Data.LoginAddress,
      versionApp: hisResponse.Data.VersionApp,
      machineName: hisResponse.Data.MachineName,
      lastAccessTime: hisResponse.Data.LastAccessTime,
      user: {
        loginName: hisResponse.Data.User.LoginName,
        userName: hisResponse.Data.User.UserName,
        applicationCode: hisResponse.Data.User.ApplicationCode,
        gCode: hisResponse.Data.User.GCode,
        email: hisResponse.Data.User.Email,
        mobile: hisResponse.Data.User.Mobile,
        roles: hisResponse.Data.RoleDatas?.map(role => ({
          roleCode: role.RoleCode,
          roleName: role.RoleName,
        })) || [],
      },
      Param: null,
    };
    
    this.logger.info('IntegrationService#hisLogin.success', {
      userId: syncResult?.userId,
      loginName: response.user?.loginName,
    });
    
    return response;
    } catch (error: any) {
      this.logger.error('IntegrationService#hisLogin.error', {
        username: request.username,
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      // Re-throw với message rõ ràng hơn để auth service có thể log
      const errorMessage = error.message || 'Unknown error';
      const enhancedError = new Error(`HIS authentication failed: ${errorMessage}`);
      (enhancedError as any).code = error.code;
      (enhancedError as any).status = error.response?.status;
      (enhancedError as any).details = error.response?.data;
      throw enhancedError;
    }
  }

  /**
   * Sync user from external system
   */
  async syncUser(user: HisUserInfo): Promise<{
    userId: string;
    created: boolean;
    username: string;
    email: string;
  }> {
    this.logger.info('IntegrationService#syncUser.call', { loginName: user.loginName });
    return this.userSyncService.syncUser(user);
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
    this.logger.info('IntegrationService#getToken.call', { userId });

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
    this.logger.info('IntegrationService#invalidateToken.call', { userId });

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
    this.logger.info('IntegrationService#renewToken.call', { 
      userId,
      renewCodePrefix: renewCode?.substring(0, 20) + '...',
    });

    try {
      // 1. Call HIS API to renew token
      const hisResponse = await this.hisProvider.renewToken(renewCode);

      // Check Success field from HIS API response
      if (!hisResponse.Success || !hisResponse.Data) {
        this.logger.warn('IntegrationService#renewToken.failed', {
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
          this.logger.info('IntegrationService#renewToken.tokenUpdated', {
            userId,
          });
        } catch (redisError: any) {
          this.logger.error('IntegrationService#renewToken.redisError', {
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
      this.logger.error('IntegrationService#renewToken.error', {
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
}

