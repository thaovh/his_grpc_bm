import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginResponseDto, RefreshTokenResponseDto } from './dto/auth-response.dto';
import { MeResponseDto } from './dto/me-response.dto';
import { RenewExternalTokenDto, RenewExternalTokenResponseDto } from './dto/renew-external-token.dto';
import { plainToInstance } from 'class-transformer';

// Extend Express Request to include user property set by JwtAuthGuard
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Req() request: Request): Promise<LoginResponseDto> {
    this.logger.info('AuthController#login.call', { username: loginDto.username });

    // Extract IP and User-Agent from request if not provided
    const ipAddress = loginDto.ipAddress || request.ip || request.headers['x-forwarded-for'] as string || 'unknown';
    const userAgent = loginDto.userAgent || request.headers['user-agent'] || 'unknown';

    const result = await this.authService.login({
      username: loginDto.username,
      password: loginDto.password,
      deviceId: loginDto.deviceId,
      ipAddress,
      userAgent,
    });

    // Log chi tiết để debug
    const hasExternalToken = !!result.externalToken;
    this.logger.info('AuthController#login.result.hasExternalToken', { 
      hasExternalToken: hasExternalToken ? 'YES' : 'NO',
    });
    
    if (result.externalToken) {
      this.logger.info('AuthController#login.result.externalToken', {
        tokenCode: result.externalToken.tokenCode?.substring(0, 20) + '...',
        renewCode: result.externalToken.renewCode?.substring(0, 20) + '...',
      });
    } else {
      this.logger.info('AuthController#login.result.noExternalToken', {
        userId: result.user.id,
        resultKeys: Object.keys(result),
      });
    }
    
    return result;
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ message: string }> {
    this.logger.info('AuthController#logout.call');
    await this.authService.logout({ refreshToken: refreshTokenDto.refreshToken });
    this.logger.info('AuthController#logout.result', { success: true });
    return { message: 'Logout successful' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed', type: RefreshTokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    this.logger.info('AuthController#refreshToken.call');
    const result = await this.authService.refreshToken(refreshTokenDto);
    this.logger.info('AuthController#refreshToken.result', { success: true });
    return result;
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user information with profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Current user information with profile', 
    type: MeResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Req() request: AuthenticatedRequest): Promise<MeResponseDto> {
    this.logger.info('AuthController#getMe.call', { userId: request.user?.id });
    
    // request.user được set bởi JwtAuthGuard sau khi validate token
    const userId = request.user?.id;
    
    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }

    // Sử dụng findByIdWithProfile để lấy cả user và profile
    const result = await this.usersService.findByIdWithProfile(userId);
    
    // Format response: gRPC trả về { user, profile }, cần combine lại
    // Loại bỏ passwordHash và version (internal fields) khỏi response
    const { passwordHash, version, ...userWithoutSensitive } = result.user || {};
    const profileData = result.profile ? (() => {
      const { version: profileVersion, ...profileWithoutVersion } = result.profile;
      
      // Compute fullName from firstName and lastName
      const fullName = this.computeFullName(
        profileWithoutVersion.firstName,
        profileWithoutVersion.lastName
      );
      
      return {
        ...profileWithoutVersion,
        fullName,
      };
    })() : null;
    
    const userData = {
      ...userWithoutSensitive,
      profile: profileData,
    };
    
    // Use class-transformer để transform và exclude các fields không cần thiết
    const response = plainToInstance(MeResponseDto, userData, {
      excludeExtraneousValues: false,
      enableImplicitConversion: true,
    });
    
    this.logger.info('AuthController#getMe.result', { userId: response.id, hasProfile: !!response.profile });
    
    return response;
  }

  @Post('renew-external-token')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Renew external HIS token' })
  @ApiResponse({ 
    status: 200, 
    description: 'External token renewed successfully', 
    type: RenewExternalTokenResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request - token renewal failed' })
  async renewExternalToken(
    @Body() renewDto: RenewExternalTokenDto,
    @Req() request: AuthenticatedRequest
  ): Promise<RenewExternalTokenResponseDto> {
    this.logger.info('AuthController#renewExternalToken.call', { 
      userId: request.user?.id,
      hasRenewCode: !!renewDto.renewCode,
    });

    try {
      // request.user được set bởi JwtAuthGuard sau khi validate token
      const userId = request.user?.id;
      
      if (!userId) {
        throw new UnauthorizedException('User not found in request');
      }

      const result = await this.authService.renewExternalToken(userId, renewDto.renewCode);
      
      this.logger.info('AuthController#renewExternalToken.result', { 
        userId,
        hasTokenCode: !!result.tokenCode,
      });

      return result;
    } catch (error: any) {
      this.logger.error('AuthController#renewExternalToken.error', {
        userId: request.user?.id,
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      throw error;
    }
  }

  /**
   * Compute fullName from firstName and lastName
   * Returns null if both are empty/null
   */
  private computeFullName(firstName?: string | null, lastName?: string | null): string | null {
    const first = firstName?.trim() || '';
    const last = lastName?.trim() || '';
    
    if (!first && !last) {
      return null;
    }
    
    return [first, last].filter(Boolean).join(' ').trim() || null;
  }
}

