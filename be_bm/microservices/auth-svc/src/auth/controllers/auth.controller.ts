import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from '../auth.interface';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { LogoutDto } from '../dto/logout.dto';
import { Count } from '../../commons/interfaces/commons.interface';

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
    this.logger.info('AuthController#login.result', { userId: result.user.id });
    return result;
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
}

