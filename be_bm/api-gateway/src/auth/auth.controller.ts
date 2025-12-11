import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginResponseDto, RefreshTokenResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
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

    this.logger.info('AuthController#login.result', { userId: result.user.id });
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
}

