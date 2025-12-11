import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { HisProvider, HisLoginRequest, HisLoginResponse, HisUserInfo } from '../../providers/his.provider';
import { RedisService } from '../redis.service';
import { UserSyncService } from '../user-sync.service';
import { UsersEnrichmentJob } from '../../enrichment/jobs/users-enrichment.job';

@Injectable()
export class AuthLoginService {
  constructor(
    private readonly hisProvider: HisProvider,
    private readonly redisService: RedisService,
    private readonly userSyncService: UserSyncService,
    private readonly usersEnrichmentJob: UsersEnrichmentJob,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthLoginService.name);
  }

  /**
   * Login to HIS system and sync user
   */
  async hisLogin(request: HisLoginRequest): Promise<HisLoginResponse> {
    this.logger.info('AuthLoginService#hisLogin.call', { username: request.username });

    try {
      // 1. Call HIS API to authenticate
      const hisResponse = await this.hisProvider.login(request);

      // hisResponse từ HIS API có format: { Success: true, Data: { ... }, Param: null }
      // Check Success field (uppercase) from HIS API response
      if (!hisResponse.Success || !hisResponse.Data) {
        this.logger.warn('AuthLoginService#hisLogin.failed', {
          username: request.username,
          Success: hisResponse.Success,
          hasData: !!hisResponse.Data,
          response: JSON.stringify(hisResponse).substring(0, 500),
        });
        return {
          success: false, // Proto expects lowercase
          Success: false, // For compatibility
          message: 'Invalid credentials',
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
        // Pass password from request to syncUser so it can update password if user exists
        syncResult = await this.userSyncService.syncUser(hisUserInfo, request.password);
        this.logger.info('AuthLoginService#hisLogin.userSynced', {
          userId: syncResult.userId,
          created: syncResult.created,
        });

        // 2.1. Enrich user data from HIS_EMPLOYEE table (async, don't block login)
        if (syncResult?.userId) {
          try {
            // Enrich user profile with data from HIS_EMPLOYEE table
            // Use loginName from HIS API response (not request.username) to ensure match with LOGINNAME in HIS_EMPLOYEE
            const loginNameForEnrich = hisUserInfo.loginName || request.username;
            await this.usersEnrichmentJob.executeForUser(loginNameForEnrich);
            this.logger.info('AuthLoginService#hisLogin.userEnriched', {
              userId: syncResult.userId,
              username: request.username,
            });
          } catch (enrichError: any) {
            // Log but don't fail login if enrichment fails
            this.logger.error('AuthLoginService#hisLogin.enrichError', {
              username: request.username,
              userId: syncResult.userId,
              error: enrichError.message,
              errorName: enrichError.name,
              errorCode: enrichError.code,
              stack: enrichError.stack?.substring(0, 500),
              fullError: JSON.stringify(enrichError, Object.getOwnPropertyNames(enrichError)).substring(0, 1000),
            });
          }
        }
      } catch (syncError: any) {
        this.logger.error('AuthLoginService#hisLogin.syncError', {
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
          this.logger.info('AuthLoginService#hisLogin.tokenStored', {
            userId: syncResult.userId,
          });
        } catch (redisError: any) {
          this.logger.error('AuthLoginService#hisLogin.redisError', {
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

      this.logger.info('AuthLoginService#hisLogin.success', {
        userId: syncResult?.userId,
        loginName: response.user?.loginName,
      });

      return response;
    } catch (error: any) {
      this.logger.error('AuthLoginService#hisLogin.error', {
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
      // Use UNAUTHENTICATED (16) if it's likely a credential issue
      const isAuthIssue = error.response?.status === 401 || error.response?.status === 403 || errorMessage.includes('credentials');
      throw new RpcException({
        code: isAuthIssue ? 16 : (error.code === 'ECONNABORTED' ? 4 : 13),
        message: errorMessage,
      });
    }
  }

  /**
   * Sync user from external system
   */
  async syncUser(user: HisUserInfo, password?: string): Promise<{
    userId: string;
    created: boolean;
    username: string;
    email: string;
  }> {
    this.logger.info('AuthLoginService#syncUser.call', { loginName: user.loginName });
    return this.userSyncService.syncUser(user, password);
  }
}

