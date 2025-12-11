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

@Injectable()
export class AuthServiceImpl implements IAuthService, OnModuleInit {
  private usersGrpcService: UsersGrpcService;

  constructor(
    @Inject('USERS_PACKAGE') private readonly usersClient: ClientGrpc,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthServiceImpl.name);
  }

  onModuleInit() {
    this.usersGrpcService = this.usersClient.getService<UsersGrpcService>('UsersService');
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    this.logger.info('AuthService#login.call', { username: loginDto.username });

    // 1. Find user by username or email via gRPC
    let user: any;
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
        this.logger.warn('AuthService#login.userNotFound', { username: loginDto.username });
        throw new Error('Invalid credentials');
      }
    }

    // 2. Verify password
    const isValidPassword = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isValidPassword) {
      this.logger.warn('AuthService#login.invalidPassword', { username: loginDto.username });
      throw new Error('Invalid credentials');
    }

    // 3. Check if user is active
    const userIsActive = (user as any).isActive;
    if (userIsActive !== 1) {
      this.logger.warn('AuthService#login.userInactive', { userId: user.id });
      throw new Error('User account is inactive');
    }

    // 4. Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN?.replace(/[^0-9]/g, '') || '900', 10); // Default 15 minutes

    // 5. Calculate expiration date for refresh token
    const refreshTokenExpiresIn = parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_IN?.replace(/[^0-9]/g, '') || '604800',
      10
    ); // Default 7 days
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + refreshTokenExpiresIn);

    // 6. Save refresh token to database
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

    this.logger.info('AuthService#login.result', { userId: user.id });

    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: userInfo,
    };
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

