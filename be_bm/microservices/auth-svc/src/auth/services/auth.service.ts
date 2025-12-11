import { Injectable, Inject, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthToken } from '../entities/auth-token.entity';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { LogoutDto } from '../dto/logout.dto';
import {
  AuthService as IAuthService,
  LoginResponse,
  RefreshTokenResponse,
  ValidateTokenResponse,
  UserInfo,
  ChangePasswordResponse,
} from '../auth.interface';
import { ChangePasswordDto } from '../dto/change-password.dto';

interface UsersGrpcService {
  findByUsername(data: { name: string }): any;
  findByEmail(data: { name: string }): any;
  findById(data: { id: string }): any;
  updatePassword(data: { id: string; password: string }): any;
}

interface HisLoginResponse {
  Success: boolean;
  success?: boolean;
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
  user?: {
    loginName: string;
    userName: string;
    applicationCode: string;
    gCode: string;
    email: string;
    mobile: string;
    roles?: Array<{
      roleCode: string;
      roleName: string;
    }>;
  };
  Param?: any;
}

interface GetTokenResponse {
  found: boolean;
  tokenCode?: string;
  renewCode?: string;
  expireTime?: string;
  loginTime?: string;
}

interface IntegrationGrpcService {
  hisLogin(data: {
    username: string;
    password: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): any;
  getToken(data: { userId: string }): any;
  renewToken(data: { renewCode: string; userId?: string }): any;
  invalidateToken(data: { userId: string }): any;
}

@Injectable()
export class AuthServiceImpl implements IAuthService, OnModuleInit {
  private usersGrpcService: UsersGrpcService;

  /**
   * Parse duration string to seconds
   * Supports formats: "7d", "30d", "604800", "604800s", etc.
   */
  private parseDurationToSeconds(duration: string | undefined): number {
    if (!duration) {
      return 604800; // Default 7 days
    }

    // If it's already a number (in seconds), return it
    const numericValue = parseInt(duration.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numericValue) && duration.replace(/[^0-9]/g, '') === duration) {
      return numericValue;
    }

    // Parse duration with unit (e.g., "7d", "30d", "1h", "30m")
    const match = duration.match(/^(\d+)([dhms])?$/i);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = (match[2] || 's').toLowerCase();

      switch (unit) {
        case 'd':
          return value * 24 * 60 * 60; // days to seconds
        case 'h':
          return value * 60 * 60; // hours to seconds
        case 'm':
          return value * 60; // minutes to seconds
        case 's':
        default:
          return value; // seconds
      }
    }

    // Fallback: try to extract number
    return numericValue || 604800; // Default 7 days
  }
  private integrationGrpcService: IntegrationGrpcService;

  constructor(
    @Inject('USERS_PACKAGE') private readonly usersClient: ClientGrpc,
    @Inject('INTEGRATION_PACKAGE') private readonly integrationClient: ClientGrpc,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(AuthServiceImpl.name);
  }

  onModuleInit() {
    this.usersGrpcService = this.usersClient.getService<UsersGrpcService>('UsersService');
    this.integrationGrpcService = this.integrationClient.getService<IntegrationGrpcService>('IntegrationService');
  }

  /**
   * Get external token from Redis and renew if expiring soon
   */
  private async getOrRenewExternalToken(userId: string): Promise<any> {
    try {
      this.logger.info('AuthService#getOrRenewExternalToken.call', { userId });

      const tokenResponse = await firstValueFrom(
        this.integrationGrpcService.getToken({ userId })
      ) as GetTokenResponse;

      if (!tokenResponse || !tokenResponse.found) {
        this.logger.info('AuthService#getOrRenewExternalToken.tokenNotFound', { userId });
        return null;
      }

      // Check expire time
      let externalTokenData: any = {
        tokenCode: tokenResponse.tokenCode || '',
        renewCode: tokenResponse.renewCode || '',
        expireTime: tokenResponse.expireTime || '',
        loginTime: tokenResponse.loginTime || '',
      };

      if (tokenResponse.expireTime) {
        try {
          const expireDate = new Date(tokenResponse.expireTime);
          const now = new Date();
          const timeUntilExpire = expireDate.getTime() - now.getTime();
          const daysUntilExpire = timeUntilExpire / (1000 * 60 * 60 * 24);

          // If expired (<= 0), return null so hisLogin can be used
          if (daysUntilExpire <= 0) {
            this.logger.info('AuthService#getOrRenewExternalToken.tokenExpired', { userId, expireTime: tokenResponse.expireTime });
            return null;
          }

          // If expiring soon (e.g., < 1 day), try auto-renew
          const RENEW_THRESHOLD_DAYS = 1;
          if (daysUntilExpire < RENEW_THRESHOLD_DAYS && tokenResponse.renewCode) {
            this.logger.info('AuthService#getOrRenewExternalToken.expiringSoon.autoRenew', { userId, daysUntilExpire });

            try {
              const renewResponse = await this.renewExternalToken(userId, tokenResponse.renewCode);
              if (renewResponse) {
                externalTokenData = renewResponse;
              }
            } catch (renewError: any) {
              this.logger.warn('AuthService#getOrRenewExternalToken.autoRenewFailed.usingOld', { userId, error: renewError.message });
            }
          }
        } catch (dateError: any) {
          this.logger.warn('AuthService#getOrRenewExternalToken.dateParseError', { userId, expireTime: tokenResponse.expireTime });
        }
      }

      return externalTokenData;
    } catch (error: any) {
      this.logger.warn('AuthService#getOrRenewExternalToken.error', { userId, error: error.message });
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    this.logger.info('AuthService#login.call', { username: loginDto.username });

    // 1. Find user by username or email via gRPC
    let user: any;
    let isExternalAuth = false;
    let externalTokenData: any = null;

    try {
      // Try username first
      user = await firstValueFrom(
        this.usersGrpcService.findByUsername({ name: loginDto.username })
      );
    } catch (error) {
      // If not found, try email
      try {
        user = await firstValueFrom(
          this.usersGrpcService.findByEmail({ name: loginDto.username })
        );
      } catch (emailError) {
        // User not found in local DB, try external authentication
        this.logger.info('AuthService#login.userNotFoundInLocal', { username: loginDto.username });
        user = null; // Set to null to trigger external auth
      }
    }

    this.logger.info('AuthService#login.userLookup', {
      username: loginDto.username,
      userFound: !!user,
      userId: user?.id,
      hasPasswordHash: !!user?.passwordHash,
      passwordHashPrefix: user?.passwordHash ? String(user.passwordHash).substring(0, 10) : null,
    });

    // 2. If user exists in local DB, verify password first
    let shouldTryExternalAuth = false;
    let isLocalPasswordValid = false;
    let hasValidRedisToken = false;

    if (user) {
      this.logger.info('AuthService#login.passwordCompare.start', {
        username: loginDto.username,
        userId: user.id,
        passwordLength: loginDto.password ? loginDto.password.length : 0,
        hasPasswordHash: !!user.passwordHash,
      });

      console.log('=== AuthService#login DEBUG ===');
      console.log('User found:', !!user, 'userId:', user?.id);
      console.log('Password hash prefix:', user?.passwordHash ? String(user.passwordHash).substring(0, 20) : null);
      console.log('Input password length:', loginDto.password ? loginDto.password.length : 0);

      const isValidPassword = await bcrypt.compare(loginDto.password, user.passwordHash);
      isLocalPasswordValid = isValidPassword;

      this.logger.info('AuthService#login.passwordCompare.result', {
        username: loginDto.username,
        userId: user.id,
        isValidPassword,
      });

      console.log('Password compare result:', isValidPassword);
      if (!isValidPassword) {
        this.logger.info('AuthService#login.invalidPassword.checkingRedis', {
          username: loginDto.username,
          userId: user.id,
        });

        // Password doesn't match, check Redis first before calling external auth
        try {
          const tokenResponse = await firstValueFrom(
            this.integrationGrpcService.getToken({ userId: user.id })
          ) as GetTokenResponse;

          if (tokenResponse && tokenResponse.found) {
            // Kiểm tra expire time của token
            let shouldUseToken = false;

            if (tokenResponse.expireTime) {
              try {
                const expireDate = new Date(tokenResponse.expireTime);
                const now = new Date();
                const timeUntilExpire = expireDate.getTime() - now.getTime();
                const daysUntilExpire = timeUntilExpire / (1000 * 60 * 60 * 24);

                // Nếu token còn valid (còn > 0 ngày), dùng token đó
                if (daysUntilExpire > 0) {
                  externalTokenData = {
                    tokenCode: tokenResponse.tokenCode || '',
                    renewCode: tokenResponse.renewCode || '',
                    expireTime: tokenResponse.expireTime || '',
                    loginTime: tokenResponse.loginTime || '',
                  };
                  this.logger.info('AuthService#login.externalTokenFoundInRedis.invalidPassword', {
                    userId: user.id,
                    daysUntilExpire: Math.floor(daysUntilExpire * 100) / 100,
                  });
                  shouldUseToken = true;
                  hasValidRedisToken = true;
                } else {
                  // Token đã hết hạn, cần lấy token mới
                  this.logger.info('AuthService#login.externalTokenExpired.invalidPassword', {
                    userId: user.id,
                    expireTime: tokenResponse.expireTime,
                  });
                }
              } catch (dateError: any) {
                // Lỗi parse date, vẫn dùng token đó
                externalTokenData = {
                  tokenCode: tokenResponse.tokenCode || '',
                  renewCode: tokenResponse.renewCode || '',
                  expireTime: tokenResponse.expireTime || '',
                  loginTime: tokenResponse.loginTime || '',
                };
                shouldUseToken = true;
                hasValidRedisToken = true;
              }
            } else {
              // Không có expireTime, dùng token đó
              externalTokenData = {
                tokenCode: tokenResponse.tokenCode || '',
                renewCode: tokenResponse.renewCode || '',
                expireTime: tokenResponse.expireTime || '',
                loginTime: tokenResponse.loginTime || '',
              };
              shouldUseToken = true;
              hasValidRedisToken = true;
            }

            if (shouldUseToken) {
              // Có token valid trong Redis, không cần gọi external auth
              shouldTryExternalAuth = false;
            } else {
              // Token hết hạn, cần gọi external auth để renew
              shouldTryExternalAuth = true;
            }
          } else {
            // Token not found in Redis, cần gọi external auth
            shouldTryExternalAuth = true;
          }
        } catch (redisError: any) {
          // Lỗi khi lấy token từ Redis, vẫn thử external auth
          this.logger.warn('AuthService#login.redisError.invalidPassword', {
            userId: user.id,
            error: redisError.message,
          });
          shouldTryExternalAuth = true;
        }
      }
    } else {
      // User not found, try external authentication
      shouldTryExternalAuth = true;
    }

    // 3. Try external authentication if needed
    if (shouldTryExternalAuth) {
      try {
        // Call integration service to authenticate with external system
        this.logger.info('AuthService#login.tryingExternalAuth', { username: loginDto.username });

        const externalResponse = await firstValueFrom(
          this.integrationGrpcService.hisLogin({
            username: loginDto.username,
            password: loginDto.password,
            deviceId: loginDto.deviceId,
            ipAddress: loginDto.ipAddress,
            userAgent: loginDto.userAgent,
          })
        ) as HisLoginResponse;

        // Check both Success (from interface) and success (from proto)
        const isSuccess = externalResponse?.Success === true || externalResponse?.success === true;

        this.logger.debug('AuthService#login.externalResponseCheck', {
          hasResponse: !!externalResponse,
          Success: externalResponse?.Success,
          success: externalResponse?.success,
          isSuccess,
          hasUser: !!externalResponse?.user,
          userLoginName: externalResponse?.user?.loginName,
        });

        if (externalResponse && isSuccess && externalResponse.user) {
          // User was synced by integration service, get the user from local DB
          try {
            user = await firstValueFrom(
              this.usersGrpcService.findByUsername({ name: externalResponse.user.loginName })
            );

            // Get token from Redis via integration service
            const tokenResponse = await firstValueFrom(
              this.integrationGrpcService.getToken({ userId: user.id })
            ) as GetTokenResponse;

            if (tokenResponse && tokenResponse.found) {
              externalTokenData = {
                tokenCode: tokenResponse.tokenCode || '',
                renewCode: tokenResponse.renewCode || '',
                expireTime: tokenResponse.expireTime || '',
                loginTime: tokenResponse.loginTime || '',
              };
            }

            isExternalAuth = true;
            this.logger.info('AuthService#login.externalAuthSuccess', { userId: user.id });
          } catch (getUserError: any) {
            this.logger.error('AuthService#login.getUserAfterSyncError', {
              username: loginDto.username,
              error: getUserError.message,
              stack: getUserError.stack?.substring(0, 500),
            });
            throw new RpcException({
              code: 13, // INTERNAL error code for gRPC
              message: 'Failed to retrieve user after external authentication',
            });
          }
        } else {
          // This will be caught by outer catch block and handled as business error
          throw new Error('External authentication failed');
        }
      } catch (externalError: any) {
        // Log chi tiết error từ integration service
        const errorMessage = externalError.message || 'Unknown error';

        // Xác định loại lỗi để có error message phù hợp
        let finalErrorMessage = 'Invalid username or password';
        let isBusinessError = false;

        if (user && !isLocalPasswordValid && !hasValidRedisToken) {
          // User tồn tại trong local DB, password local sai, không có Redis token
          // Đã thử external auth nhưng fail
          finalErrorMessage = 'Invalid username or password';
          isBusinessError = true;
          this.logger.warn('AuthService#login.invalidCredentials', {
            username: loginDto.username,
            userId: user.id,
            reason: 'Local password invalid and external auth failed',
          });
        } else if (!user) {
          // User không tồn tại trong local DB, external auth cũng fail
          finalErrorMessage = 'Invalid username or password';
          isBusinessError = true;
          this.logger.warn('AuthService#login.userNotFound', {
            username: loginDto.username,
            reason: 'User not found in local DB and external auth failed',
          });
        }

        // Log error - chỉ log stack trace cho technical errors, không log cho business errors
        if (isBusinessError) {
          // Business logic error - chỉ log message, không log stack trace
          this.logger.warn('AuthService#login.authenticationFailed', {
            username: loginDto.username,
            reason: finalErrorMessage,
          });
        } else {
          // Technical error - log đầy đủ bao gồm stack trace
          this.logger.error('AuthService#login.externalAuthFailed', {
            username: loginDto.username,
            error: errorMessage,
            errorType: externalError.constructor?.name,
            stack: externalError.stack?.substring(0, 500),
            details: externalError.details,
            code: externalError.code,
          });
        }

        // Nếu error message có chứa thông tin cụ thể (technical error), giữ nguyên
        if (errorMessage.includes('405') || errorMessage.includes('Method not allowed')) {
          throw new RpcException({
            code: 13, // INTERNAL error code for gRPC
            message: `HIS API error: ${errorMessage}`,
          });
        }

        // Business logic error - sử dụng RpcException với UNAUTHENTICATED code
        throw new RpcException({
          code: 16, // UNAUTHENTICATED error code for gRPC
          message: finalErrorMessage,
        });
      }
    }

    // 3. Check if user is active
    const userIsActive = (user as any).isActive;
    if (userIsActive !== 1) {
      this.logger.warn('AuthService#login.userInactive', { userId: user.id });
      throw new RpcException({
        code: 7, // PERMISSION_DENIED error code for gRPC
        message: 'User account is inactive',
      });
    }

    // 4. Try to get external token (from Redis or hisLogin)
    // This logic is simplified: either we have it from externalResponse above, or we check Redis
    if (!externalTokenData && user) {
      externalTokenData = await this.getOrRenewExternalToken(user.id);

      // If still no token and we have credentials, try hisLogin one last time
      if (!externalTokenData && loginDto.username && loginDto.password) {
        try {
          this.logger.info('AuthService#login.tokenNotFound.tryingHisLogin', { userId: user.id });
          const externalResponse = await firstValueFrom(
            this.integrationGrpcService.hisLogin({
              username: loginDto.username,
              password: loginDto.password,
              deviceId: loginDto.deviceId,
              ipAddress: loginDto.ipAddress,
              userAgent: loginDto.userAgent,
            })
          ) as HisLoginResponse;

          const isSuccess = externalResponse?.Success === true || externalResponse?.success === true;
          if (isSuccess && externalResponse.user) {
            externalTokenData = await this.getOrRenewExternalToken(user.id);
            // Merge roles: Local Roles (from DB) + External Roles (from HIS)
            const localRoles = user.roles ? user.roles.map((r: any) => r.code) : [];
            const externalRoles = externalResponse.user.roles ? externalResponse.user.roles.map(r => r.roleCode) : [];
            // Remove duplicates
            user.roles = [...new Set([...localRoles, ...externalRoles])];
          }
        } catch (error) {
          this.logger.warn('AuthService#login.finalHisLoginAttemptFailed', { userId: user.id, error: error.message });
        }
      }
    }

    // 5. Nếu user tồn tại và mật khẩu local sai, và KHÔNG phải external auth -> từ chối
    if (user && !isLocalPasswordValid && !isExternalAuth) {
      this.logger.warn('AuthService#login.invalidPassword.reject', {
        username: loginDto.username,
        userId: user.id,
        hasValidRedisToken,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // 6. Generate tokens - LUÔN generate JWT token local
    // Ensure roles are flattened to codes (strings) if they are still objects (from local DB only login case)
    if (user.roles && user.roles.length > 0 && typeof user.roles[0] === 'object') {
      user.roles = user.roles.map((r: any) => r.code);
    }
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();
    const expiresIn = this.parseDurationToSeconds(this.configService.get('JWT_EXPIRES_IN') || '15m');

    this.logger.info('AuthService#login.tokensGenerated', {
      expiresInSeconds: expiresIn,
      expiresInFromConfig: this.configService.get('JWT_EXPIRES_IN')
    });

    // 7. Save refresh token to database (luôn lưu cho JWT tokens)
    const refreshTokenExpiresIn = this.parseDurationToSeconds(
      this.configService.get('REFRESH_TOKEN_EXPIRES_IN')
    ); // Default 7 days
    const nowForToken = new Date();
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + refreshTokenExpiresIn);

    this.logger.info('AuthService#login.createToken', {
      refreshTokenExpiresIn,
      nowForTokenISO: nowForToken.toISOString(),
      expiresAtISO: expiresAt.toISOString(),
      expiresAtTime: expiresAt.getTime(),
      timeDiffSeconds: Math.floor((expiresAt.getTime() - nowForToken.getTime()) / 1000),
    });

    await this.authRepository.createToken({
      userId: user.id,
      refreshToken,
      deviceId: loginDto.deviceId,
      ipAddress: loginDto.ipAddress,
      userAgent: loginDto.userAgent,
      expiresAt,
    });

    // 7. Convert Long objects to numbers
    const acsId = user.acsId && typeof user.acsId === 'object' && 'low' in user.acsId
      ? user.acsId.low + (user.acsId.high * 0x100000000)
      : user.acsId;

    const userInfo: UserInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      acsId: acsId || null,
      employeeCode: user.attendanceId || null,
      roles: user.roles || [],
    };

    // 7. Build response - thêm externalToken nếu có
    const response: LoginResponse = {
      accessToken,
      refreshToken,
      expiresIn,
      user: userInfo,
    };

    // Nếu có external token (từ Redis hoặc từ external auth), thêm vào response
    if (externalTokenData) {
      // Đảm bảo tất cả fields đều có giá trị (không phải undefined)
      response.externalToken = {
        tokenCode: externalTokenData.tokenCode || '',
        renewCode: externalTokenData.renewCode || '',
        expireTime: externalTokenData.expireTime || '',
        loginTime: externalTokenData.loginTime || '',
      };
      this.logger.info('AuthService#login.externalTokenAddedToResponse', {
        userId: user.id,
        hasTokenCode: !!externalTokenData.tokenCode,
        hasRenewCode: !!externalTokenData.renewCode,
        externalTokenObject: JSON.stringify(response.externalToken),
      });
    } else {
      this.logger.info('AuthService#login.noExternalToken', {
        userId: user.id,
        username: loginDto.username,
        reason: 'externalTokenData is null or undefined',
      });
    }

    // Log response object trước khi trả về
    this.logger.info('AuthService#login.result', {
      userId: user.id,
      isExternalAuth,
      hasExternalToken: !!response.externalToken,
      responseKeys: Object.keys(response),
    });

    return response;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponse> {
    this.logger.info('AuthService#refreshToken.call', { refreshToken: refreshTokenDto.refreshToken.substring(0, 20) + '...' });

    // 1. Find token in database
    const token = await this.authRepository.findTokenByRefreshToken(refreshTokenDto.refreshToken);
    if (!token) {
      this.logger.warn('AuthService#refreshToken.tokenNotFound');
      this.logger.warn('AuthService#refreshToken.invalidToken');
      throw new RpcException({
        code: 16, // UNAUTHENTICATED error code for gRPC
        message: 'Invalid refresh token',
      });
    }

    // 2. Check if token is expired
    // Ensure tokenExpiresAt is a Date object
    const tokenExpiresAt = token.expiresAt instanceof Date
      ? token.expiresAt
      : new Date(token.expiresAt);
    const now = new Date();

    const expiresAtTime = tokenExpiresAt.getTime();
    const nowTime = now.getTime();
    const timeDiff = expiresAtTime - nowTime;
    const isExpired = tokenExpiresAt < now;

    this.logger.info('AuthService#refreshToken.tokenCheck', {
      tokenId: token.id,
      tokenExpiresAtType: typeof token.expiresAt,
      tokenExpiresAtValue: token.expiresAt,
      tokenExpiresAtISO: tokenExpiresAt.toISOString(),
      nowISO: now.toISOString(),
      expiresAtTime: expiresAtTime,
      nowTime: nowTime,
      timeDiffMs: timeDiff,
      timeDiffSeconds: Math.floor(timeDiff / 1000),
      isExpired: isExpired,
    });

    if (isExpired) {
      this.logger.warn('AuthService#refreshToken.tokenExpired', {
        tokenId: token.id,
        tokenExpiresAtISO: tokenExpiresAt.toISOString(),
        nowISO: now.toISOString(),
        timeDiffMs: timeDiff,
        timeDiffSeconds: Math.floor(timeDiff / 1000),
      });
      throw new RpcException({
        code: 16, // UNAUTHENTICATED error code for gRPC
        message: 'Refresh token expired',
      });
    }

    // 3. Check if token is revoked
    if (token.isRevoked === 1) {
      this.logger.warn('AuthService#refreshToken.tokenRevoked', { tokenId: token.id });
      this.logger.warn('AuthService#refreshToken.tokenRevoked');
      throw new RpcException({
        code: 16, // UNAUTHENTICATED error code for gRPC
        message: 'Refresh token revoked',
      });
    }

    // 4. Get user info via gRPC
    const user: any = await firstValueFrom(
      this.usersGrpcService.findById({ id: token.userId })
    );

    const userIsActive = user ? (user as any).isActive : 0;
    if (!user || userIsActive !== 1) {
      this.logger.warn('AuthService#refreshToken.userNotFoundOrInactive', { userId: token.userId });
      this.logger.warn('AuthService#refreshToken.userNotFoundOrInactive');
      throw new RpcException({
        code: 7, // PERMISSION_DENIED error code for gRPC
        message: 'User not found or inactive',
      });
    }

    // 5. Generate new access token
    const accessToken = this.generateAccessToken(user);

    // 6. Optionally generate new refresh token (rotate)
    const newRefreshToken = this.generateRefreshToken();
    const refreshTokenExpiresIn = this.parseDurationToSeconds(
      process.env.REFRESH_TOKEN_EXPIRES_IN
    );
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + refreshTokenExpiresIn);

    // 7. Revoke old token and create new one
    await this.authRepository.revokeToken(token.refreshToken);
    await this.authRepository.createToken({
      userId: token.userId,
      refreshToken: newRefreshToken,
      deviceId: token.deviceId,
      ipAddress: token.ipAddress,
      userAgent: token.userAgent,
      expiresAt,
    });

    const expiresIn = this.parseDurationToSeconds(this.configService.get('JWT_EXPIRES_IN') || '15m');

    // 8. Try to get external token for parity
    const externalTokenData = await this.getOrRenewExternalToken(user.id);

    // 9. Standardize acsId
    const acsId = user.acsId && typeof user.acsId === 'object' && 'low' in user.acsId
      ? user.acsId.low + (user.acsId.high * 0x100000000)
      : user.acsId;

    // 10. Flatten roles to codes only
    const roles = user.roles && Array.isArray(user.roles)
      ? user.roles.map((role: any) => typeof role === 'object' ? role.code : role)
      : [];

    this.logger.info('AuthService#refreshToken.result', { userId: token.userId });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        acsId: acsId || null,
        employeeCode: user.attendanceId || null,
        roles,
      },
      externalToken: externalTokenData ? {
        tokenCode: externalTokenData.tokenCode || '',
        renewCode: externalTokenData.renewCode || '',
        expireTime: externalTokenData.expireTime || '',
        loginTime: externalTokenData.loginTime || '',
      } : undefined,
    };
  }

  async logout(logoutDto: LogoutDto): Promise<number> {
    this.logger.info('AuthService#logout.call', { refreshToken: logoutDto.refreshToken.substring(0, 20) + '...' });
    await this.authRepository.revokeToken(logoutDto.refreshToken);
    this.logger.info('AuthService#logout.result', { revoked: true });
    return 1;
  }

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    this.logger.info('AuthService#validateToken.call', { token: token.substring(0, 20) + '...' });

    try {
      // Verify JWT token
      const payload = this.jwtService.verify(token);

      // Check if user still exists and is active
      const user = await firstValueFrom(
        this.usersGrpcService.findById({ id: payload.sub })
      );

      const userIsActive = user ? (user as any).isActive : 0;
      if (!user || userIsActive !== 1) {
        this.logger.warn('AuthService#validateToken.userNotFoundOrInactive', { userId: payload.sub });
        return {
          isValid: false,
          userId: payload.sub,
          expiresAt: payload.exp || 0,
          employeeCode: null,
          roles: [],
        };
      }

      this.logger.info('AuthService#validateToken.result', { isValid: true, userId: payload.sub });

      return {
        isValid: true,
        userId: payload.sub,
        expiresAt: payload.exp || 0,
        employeeCode: payload.employeeCode || null,
        roles: payload.roles || [],
      };
    } catch (error) {
      this.logger.warn('AuthService#validateToken.invalidToken', { error: error.message });
      return {
        isValid: false,
        userId: '',
        expiresAt: 0,
        employeeCode: null,
        roles: [],
      };
    }
  }

  async revokeToken(logoutDto: LogoutDto): Promise<number> {
    return this.logout(logoutDto);
  }

  async renewExternalToken(userId: string, renewCode?: string): Promise<{
    tokenCode: string;
    renewCode: string;
    expireTime: string;
    loginTime: string;
  }> {
    this.logger.info('AuthService#renewExternalToken.call', { userId, hasRenewCode: !!renewCode });

    try {
      let actualRenewCode = renewCode;

      // Nếu không có renewCode, lấy từ Redis
      if (!actualRenewCode) {
        const tokenResponse = await firstValueFrom(
          this.integrationGrpcService.getToken({ userId })
        ) as GetTokenResponse;

        if (!tokenResponse || !tokenResponse.found || !tokenResponse.renewCode) {
          this.logger.warn('AuthService#renewExternalToken.tokenNotFound');
          throw new RpcException({
            code: 5, // NOT_FOUND error code for gRPC
            message: 'Token not found in Redis or renewCode is missing',
          });
        }

        actualRenewCode = tokenResponse.renewCode;
        this.logger.info('AuthService#renewExternalToken.renewCodeFromRedis', { userId });
      }

      // Gọi integration service để renew token
      const renewResponse = await firstValueFrom(
        this.integrationGrpcService.renewToken({
          renewCode: actualRenewCode,
          userId: userId,
        })
      ) as any;

      if (!renewResponse || !renewResponse.success) {
        this.logger.warn('AuthService#renewExternalToken.renewalFailed', {
          message: renewResponse?.message,
        });
        throw new RpcException({
          code: 13, // INTERNAL error code for gRPC
          message: renewResponse?.message || 'Token renewal failed',
        });
      }

      const externalTokenData = {
        tokenCode: renewResponse.tokenCode || '',
        renewCode: renewResponse.renewCode || '',
        expireTime: renewResponse.expireTime || '',
        loginTime: renewResponse.loginTime || '',
      };

      this.logger.info('AuthService#renewExternalToken.success', {
        userId,
        newExpireTime: externalTokenData.expireTime,
      });

      return externalTokenData;
    } catch (error: any) {
      this.logger.error('AuthService#renewExternalToken.error', {
        userId,
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      this.logger.error('AuthService#renewExternalToken.error', {
        error: error.message,
        stack: error.stack?.substring(0, 500),
      });
      throw new RpcException({
        code: 13, // INTERNAL error code for gRPC
        message: `Failed to renew external token: ${error.message}`,
      });
    }
  }

  /**
   * Change password by validating old password locally, then verifying new password with HIS.
   * On success: update local password, overwrite HIS token in Redis (via hisLogin) and revoke local refresh tokens.
   */
  async changePassword(params: ChangePasswordDto): Promise<ChangePasswordResponse> {
    const { userId, username, oldPassword, newPassword, deviceId, ipAddress, userAgent } = params;
    this.logger.info('AuthService#changePassword.call', {
      userId,
      hasUsername: !!username,
      hasDeviceId: !!deviceId,
    });

    try {
      // 1. Fetch user
      const user: any = await firstValueFrom(
        this.usersGrpcService.findById({ id: userId })
      );

      if (!user || user.isActive === 0) {
        this.logger.warn('AuthService#changePassword.userNotFoundOrInactive', { userId });
        throw new RpcException({
          code: 16,
          message: 'User not found or inactive',
        });
      }

      if (!user.passwordHash) {
        this.logger.warn('AuthService#changePassword.missingPasswordHash', { userId });
        throw new RpcException({
          code: 16,
          message: 'Old password is incorrect',
        });
      }

      // 2. Validate old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
      this.logger.info('AuthService#changePassword.oldPasswordCheck', {
        userId,
        isOldPasswordValid,
      });

      if (!isOldPasswordValid) {
        throw new RpcException({
          code: 16,
          message: 'Old password is incorrect',
        });
      }

      const hisUsername = (username || user.username || '').trim();
      if (!hisUsername) {
        throw new RpcException({
          code: 16,
          message: 'Username is required',
        });
      }

      // 3. Clear existing HIS token in Redis (best effort)
      try {
        await firstValueFrom(this.integrationGrpcService.invalidateToken({ userId }));
      } catch (clearError: any) {
        this.logger.warn('AuthService#changePassword.invalidateToken.failed', {
          userId,
          error: clearError.message,
        });
      }

      // 4. Validate new password with HIS (also overwrites Redis token on success)
      const hisResponse = await firstValueFrom(
        this.integrationGrpcService.hisLogin({
          username: hisUsername,
          password: newPassword,
          deviceId,
          ipAddress,
          userAgent,
        })
      ) as HisLoginResponse;

      const hisSuccess = hisResponse?.Success === true || hisResponse?.success === true;
      if (!hisSuccess || !hisResponse?.tokenCode) {
        this.logger.warn('AuthService#changePassword.hisLoginFailed', {
          userId,
          message: hisResponse?.message,
          hasToken: !!hisResponse?.tokenCode,
        });
        throw new RpcException({
          code: 16,
          message: hisResponse?.message || 'HIS login failed with new password',
        });
      }

      // 5. Update local password via users service (hashing handled there)
      await firstValueFrom(
        this.usersGrpcService.updatePassword({
          id: userId,
          password: newPassword,
        })
      );
      this.logger.info('AuthService#changePassword.passwordUpdated', { userId });

      // 6. Revoke all existing refresh tokens to force re-login
      await this.authRepository.revokeAllUserTokens(userId);
      this.logger.info('AuthService#changePassword.tokensRevoked', { userId });

      return {
        success: true,
        message: 'Password updated successfully. Please login again.',
      };
    } catch (error: any) {
      this.logger.error('AuthService#changePassword.error', {
        userId,
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        code: 13,
        message: error.message || 'Failed to change password',
      });
    }
  }

  private generateAccessToken(user: any): string {
    // Flatten roles to codes only for JWT payload
    const roles = user.roles && Array.isArray(user.roles)
      ? user.roles.map((role: any) => typeof role === 'object' ? role.code : role)
      : [];

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      acsId: user.acsId && typeof user.acsId === 'object' && 'low' in user.acsId
        ? user.acsId.low + (user.acsId.high * 0x100000000)
        : user.acsId,
      roles,
      employeeCode: user.attendanceId || null,
      iss: 'bmaibe-auth-service', // Required for Kong JWT Plugin identification
    };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(): string {
    // Generate a secure random token
    return randomBytes(64).toString('hex');
  }
}

