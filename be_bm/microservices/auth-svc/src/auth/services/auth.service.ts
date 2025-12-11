import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
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
} from '../auth.interface';

interface UsersGrpcService {
  findByUsername(data: { name: string }): any;
  findByEmail(data: { name: string }): any;
  findById(data: { id: string }): any;
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
}

@Injectable()
export class AuthServiceImpl implements IAuthService, OnModuleInit {
  private usersGrpcService: UsersGrpcService;
  private integrationGrpcService: IntegrationGrpcService;

  constructor(
    @Inject('USERS_PACKAGE') private readonly usersClient: ClientGrpc,
    @Inject('INTEGRATION_PACKAGE') private readonly integrationClient: ClientGrpc,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthServiceImpl.name);
  }

  onModuleInit() {
    this.usersGrpcService = this.usersClient.getService<UsersGrpcService>('UsersService');
    this.integrationGrpcService = this.integrationClient.getService<IntegrationGrpcService>('IntegrationService');
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

    // 2. If user exists in local DB, verify password first
    let shouldTryExternalAuth = false;
    let isLocalPasswordValid = false;
    
    if (user) {
      const isValidPassword = await bcrypt.compare(loginDto.password, user.passwordHash);
      isLocalPasswordValid = isValidPassword;
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
            }
            
            if (shouldUseToken) {
              // Có token valid trong Redis, không cần gọi external auth
              shouldTryExternalAuth = false;
            } else {
              // Token hết hạn, cần gọi external auth
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
            });
            throw new Error('Failed to retrieve user after external authentication');
          }
        } else {
          throw new Error('External authentication failed');
        }
      } catch (externalError: any) {
        // Log chi tiết error từ integration service
        const errorMessage = externalError.message || 'Unknown error';
        this.logger.error('AuthService#login.externalAuthFailed', { 
          username: loginDto.username,
          error: errorMessage,
          errorType: externalError.constructor?.name,
          stack: externalError.stack?.substring(0, 500), // Limit stack trace
          details: externalError.details,
          code: externalError.code,
        });
        
        // Nếu error message có chứa thông tin cụ thể, giữ nguyên
        if (errorMessage.includes('405') || errorMessage.includes('Method not allowed')) {
          throw new Error(`HIS API error: ${errorMessage}`);
        }
        
        throw new Error('Invalid credentials');
      }
    }

    // 3. Check if user is active
    const userIsActive = (user as any).isActive;
    if (userIsActive !== 1) {
      this.logger.warn('AuthService#login.userInactive', { userId: user.id });
      throw new Error('User account is inactive');
    }

    // 4. Try to get external token from Redis (if user was synced from HIS)
    // This allows us to return externalToken even if user logged in with local password
    if (!externalTokenData && user) {
      try {
        this.logger.info('AuthService#login.checkingRedisToken', { userId: user.id });
        
        const tokenResponse = await firstValueFrom(
          this.integrationGrpcService.getToken({ userId: user.id })
        ) as GetTokenResponse;
        
        if (tokenResponse && tokenResponse.found) {
          // Kiểm tra expire time của token
          let shouldUseToken = true;
          let daysUntilExpire = 0;
          
          if (tokenResponse.expireTime) {
            try {
              const expireDate = new Date(tokenResponse.expireTime);
              const now = new Date();
              const timeUntilExpire = expireDate.getTime() - now.getTime();
              daysUntilExpire = timeUntilExpire / (1000 * 60 * 60 * 24);
              
              // Nếu token còn valid (còn > 0 ngày), dùng token đó
              if (daysUntilExpire > 0) {
                // Nếu token sắp hết hạn (còn < 1 ngày), tự động renew
                const RENEW_THRESHOLD_DAYS = 1; // Renew nếu còn < 1 ngày
                if (daysUntilExpire < RENEW_THRESHOLD_DAYS && tokenResponse.renewCode) {
                  this.logger.info('AuthService#login.externalTokenExpiringSoon.autoRenew', {
                    userId: user.id,
                    daysUntilExpire: Math.floor(daysUntilExpire * 100) / 100,
                  });
                  
                  try {
                    // Gọi renew token
                    const renewResponse = await firstValueFrom(
                      this.integrationGrpcService.renewToken({
                        renewCode: tokenResponse.renewCode,
                        userId: user.id,
                      })
                    ) as any;
                    
                    if (renewResponse && renewResponse.success) {
                      // Cập nhật token mới
                      externalTokenData = {
                        tokenCode: renewResponse.tokenCode || '',
                        renewCode: renewResponse.renewCode || '',
                        expireTime: renewResponse.expireTime || '',
                        loginTime: renewResponse.loginTime || '',
                      };
                      this.logger.info('AuthService#login.externalTokenRenewed', {
                        userId: user.id,
                        newExpireTime: renewResponse.expireTime,
                      });
                    } else {
                      // Renew failed, dùng token cũ
                      this.logger.warn('AuthService#login.externalTokenRenewFailed.usingOldToken', {
                        userId: user.id,
                        error: renewResponse?.message,
                      });
                      externalTokenData = {
                        tokenCode: tokenResponse.tokenCode || '',
                        renewCode: tokenResponse.renewCode || '',
                        expireTime: tokenResponse.expireTime || '',
                        loginTime: tokenResponse.loginTime || '',
                      };
                    }
                  } catch (renewError: any) {
                    // Renew failed, dùng token cũ
                    this.logger.warn('AuthService#login.externalTokenRenewError.usingOldToken', {
                      userId: user.id,
                      error: renewError.message,
                    });
                    externalTokenData = {
                      tokenCode: tokenResponse.tokenCode || '',
                      renewCode: tokenResponse.renewCode || '',
                      expireTime: tokenResponse.expireTime || '',
                      loginTime: tokenResponse.loginTime || '',
                    };
                  }
                } else {
                  // Token còn nhiều thời gian, dùng token đó
                  externalTokenData = {
                    tokenCode: tokenResponse.tokenCode || '',
                    renewCode: tokenResponse.renewCode || '',
                    expireTime: tokenResponse.expireTime || '',
                    loginTime: tokenResponse.loginTime || '',
                  };
                  this.logger.info('AuthService#login.externalTokenFoundInRedis', { 
                    userId: user.id,
                    hasTokenCode: !!tokenResponse.tokenCode,
                    daysUntilExpire: Math.floor(daysUntilExpire * 100) / 100, // 2 decimal places
                    expireTime: tokenResponse.expireTime,
                  });
                }
                shouldUseToken = true;
              } else {
                // Token đã hết hạn, cần lấy token mới
                this.logger.info('AuthService#login.externalTokenExpired', {
                  userId: user.id,
                  expireTime: tokenResponse.expireTime,
                  daysUntilExpire: Math.floor(daysUntilExpire * 100) / 100,
                });
                shouldUseToken = false;
              }
            } catch (dateError: any) {
              // Lỗi parse date, vẫn dùng token đó nhưng log warning
              this.logger.warn('AuthService#login.externalTokenInvalidExpireTime', {
                userId: user.id,
                expireTime: tokenResponse.expireTime,
                error: dateError.message,
              });
              externalTokenData = {
                tokenCode: tokenResponse.tokenCode || '',
                renewCode: tokenResponse.renewCode || '',
                expireTime: tokenResponse.expireTime || '',
                loginTime: tokenResponse.loginTime || '',
              };
              shouldUseToken = true;
            }
          } else {
            // Không có expireTime, dùng token đó
            externalTokenData = {
              tokenCode: tokenResponse.tokenCode || '',
              renewCode: tokenResponse.renewCode || '',
              expireTime: tokenResponse.expireTime || '',
              loginTime: tokenResponse.loginTime || '',
            };
            this.logger.info('AuthService#login.externalTokenFoundInRedis.noExpireTime', { 
              userId: user.id,
              hasTokenCode: !!tokenResponse.tokenCode,
            });
            shouldUseToken = true;
          }
          
          // Nếu token không hợp lệ hoặc đã hết hạn, cần lấy token mới
          if (!shouldUseToken) {
            externalTokenData = null; // Reset để gọi hisLogin()
          }
        } else {
          // Token not found in Redis
          this.logger.info('AuthService#login.externalTokenNotFoundInRedis', {
            userId: user.id,
            username: loginDto.username,
            found: tokenResponse?.found,
          });
        }
        
        // Chỉ gọi hisLogin() nếu không có token hoặc token đã hết hạn
        if (!externalTokenData) {
          // Token not found in Redis or expired, try to get new token from external auth
          // This happens if user was synced from HIS but token expired or was cleared
          this.logger.info('AuthService#login.externalTokenNotFoundOrExpired.tryingExternalAuth', {
            userId: user.id,
            username: loginDto.username,
          });
          
          try {
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
            if (externalResponse && isSuccess && externalResponse.user) {
              // Get token from Redis (should be stored by integration service)
              const newTokenResponse = await firstValueFrom(
                this.integrationGrpcService.getToken({ userId: user.id })
              ) as GetTokenResponse;
              
              if (newTokenResponse && newTokenResponse.found) {
                externalTokenData = {
                  tokenCode: newTokenResponse.tokenCode || '',
                  renewCode: newTokenResponse.renewCode || '',
                  expireTime: newTokenResponse.expireTime || '',
                  loginTime: newTokenResponse.loginTime || '',
                };
                this.logger.info('AuthService#login.externalTokenRetrievedAfterAuth', { 
                  userId: user.id,
                  expireTime: newTokenResponse.expireTime,
                });
              }
            }
          } catch (externalAuthError: any) {
            // External auth failed, but user can still login with local password
            this.logger.warn('AuthService#login.externalAuthFailedForToken', {
              userId: user.id,
              username: loginDto.username,
              error: externalAuthError.message,
              errorType: externalAuthError.constructor?.name,
              code: externalAuthError.code,
            });
          }
        }
      } catch (error: any) {
        // If token not found in Redis, it's okay - user might not be from HIS
        this.logger.warn('AuthService#login.externalTokenError', {
          userId: user.id,
          error: error.message,
          errorType: error.constructor?.name,
          stack: error.stack?.substring(0, 500),
        });
      }
    }

    // 5. Generate tokens - LUÔN generate JWT token local
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN?.replace(/[^0-9]/g, '') || '900', 10);

    // 6. Save refresh token to database (luôn lưu cho JWT tokens)
    const refreshTokenExpiresIn = parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_IN?.replace(/[^0-9]/g, '') || '604800',
      10
    ); // Default 7 days
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + refreshTokenExpiresIn);

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
      throw new Error('Invalid refresh token');
    }

    // 2. Check if token is expired
    if (token.expiresAt < new Date()) {
      this.logger.warn('AuthService#refreshToken.tokenExpired', { tokenId: token.id });
      throw new Error('Refresh token expired');
    }

    // 3. Check if token is revoked
    if (token.isRevoked === 1) {
      this.logger.warn('AuthService#refreshToken.tokenRevoked', { tokenId: token.id });
      throw new Error('Refresh token revoked');
    }

    // 4. Get user info via gRPC
    const user = await firstValueFrom(
      this.usersGrpcService.findById({ id: token.userId })
    );

    const userIsActive = user ? (user as any).isActive : 0;
    if (!user || userIsActive !== 1) {
      this.logger.warn('AuthService#refreshToken.userNotFoundOrInactive', { userId: token.userId });
      throw new Error('User not found or inactive');
    }

    // 5. Generate new access token
    const accessToken = this.generateAccessToken(user);

    // 6. Optionally generate new refresh token (rotate)
    const newRefreshToken = this.generateRefreshToken();
    const refreshTokenExpiresIn = parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_IN?.replace(/[^0-9]/g, '') || '604800',
      10
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

    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN?.replace(/[^0-9]/g, '') || '900', 10);

    this.logger.info('AuthService#refreshToken.result', { userId: token.userId });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
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
        };
      }

      this.logger.info('AuthService#validateToken.result', { isValid: true, userId: payload.sub });

      return {
        isValid: true,
        userId: payload.sub,
        expiresAt: payload.exp || 0,
      };
    } catch (error) {
      this.logger.warn('AuthService#validateToken.invalidToken', { error: error.message });
      return {
        isValid: false,
        userId: '',
        expiresAt: 0,
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
          throw new Error('Token not found in Redis or renewCode is missing');
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
        throw new Error(renewResponse?.message || 'Token renewal failed');
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
      throw new Error(`Failed to renew external token: ${error.message}`);
    }
  }

  private generateAccessToken(user: any): string {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      acsId: user.acsId && typeof user.acsId === 'object' && 'low' in user.acsId
        ? user.acsId.low + (user.acsId.high * 0x100000000)
        : user.acsId,
    };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(): string {
    // Generate a secure random token
    return randomBytes(64).toString('hex');
  }
}

