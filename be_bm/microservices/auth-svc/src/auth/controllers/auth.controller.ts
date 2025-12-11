import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from '../auth.interface';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { LogoutDto } from '../dto/logout.dto';
import { Count } from '../../commons/interfaces/commons.interface';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Controller()
export class AuthController {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(AuthController.name);
  }

  @GrpcMethod('AuthService', 'login')
  async login(data: LoginDto) {
    this.logger.info('AuthController#login.call', { username: data.username });
    const result = await this.authService.login(data);
    
    // Đảm bảo externalToken được set đúng cách cho gRPC serialization
    // Tạo một object mới với tất cả fields để đảm bảo gRPC serialize đúng
    const response: any = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      user: result.user,
    };
    
    // Nếu có externalToken, thêm vào response với tất cả fields
    if (result.externalToken) {
      response.externalToken = {
        tokenCode: result.externalToken.tokenCode || '',
        renewCode: result.externalToken.renewCode || '',
        expireTime: result.externalToken.expireTime || '',
        loginTime: result.externalToken.loginTime || '',
      };
      this.logger.info('AuthController#login.result.externalToken', {
        tokenCode: result.externalToken.tokenCode?.substring(0, 20) + '...',
        renewCode: result.externalToken.renewCode?.substring(0, 20) + '...',
      });
    }
    
    return response;
  }

  @GrpcMethod('AuthService', 'logout')
  async logout(data: LogoutDto): Promise<Count> {
    this.logger.info('AuthController#logout.call', { refreshToken: data.refreshToken.substring(0, 20) + '...' });
    const count = await this.authService.logout(data);
    this.logger.info('AuthController#logout.result', { count });
    return { count };
  }

  @GrpcMethod('AuthService', 'refreshToken')
  async refreshToken(data: RefreshTokenDto) {
    this.logger.info('AuthController#refreshToken.call', { refreshToken: data.refreshToken.substring(0, 20) + '...' });
    const result = await this.authService.refreshToken(data);
    this.logger.info('AuthController#refreshToken.result', { success: true });
    return result;
  }

  @GrpcMethod('AuthService', 'validateToken')
  async validateToken(data: { token: string }) {
    this.logger.info('AuthController#validateToken.call', { token: data.token.substring(0, 20) + '...' });
    const result = await this.authService.validateToken(data.token);
    this.logger.info('AuthController#validateToken.result', { isValid: result.isValid });
    return result;
  }

  @GrpcMethod('AuthService', 'revokeToken')
  async revokeToken(data: LogoutDto): Promise<Count> {
    this.logger.info('AuthController#revokeToken.call', { refreshToken: data.refreshToken.substring(0, 20) + '...' });
    const count = await this.authService.revokeToken(data);
    this.logger.info('AuthController#revokeToken.result', { count });
    return { count };
  }

  @GrpcMethod('AuthService', 'renewExternalToken')
  async renewExternalToken(data: { renewCode?: string; userId?: string }) {
    this.logger.info('AuthController#renewExternalToken.call', { 
      userId: data.userId,
      hasRenewCode: !!data.renewCode,
    });
    
    if (!data.userId) {
      throw new Error('UserId is required');
    }

    const result = await this.authService.renewExternalToken(data.userId, data.renewCode);
    
    this.logger.info('AuthController#renewExternalToken.result', {
      userId: data.userId,
      hasTokenCode: !!result.tokenCode,
    });

    return {
      externalToken: {
        tokenCode: result.tokenCode || '',
        renewCode: result.renewCode || '',
        expireTime: result.expireTime || '',
        loginTime: result.loginTime || '',
      },
    };
  }

  @GrpcMethod('AuthService', 'changePassword')
  async changePassword(data: ChangePasswordDto) {
    this.logger.info('AuthController#changePassword.call', {
      userId: data.userId,
      hasDeviceId: !!data.deviceId,
    });
    return this.authService.changePassword(data);
  }
}

