import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AuthService as IAuthService } from '../../auth/auth.interface';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private authGrpcService: IAuthService;

  constructor(
    @Inject('AUTH_PACKAGE') private readonly authClient: ClientGrpc,
    private readonly reflector: Reflector,
  ) {
    this.authGrpcService = this.authClient.getService<IAuthService>('AuthService');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Validate token via auth-svc
      const result = await firstValueFrom(
        this.authGrpcService.validateToken({ token })
      );

      if (result.isValid) {
        // Attach user info to request
        request.user = {
          id: result.userId,
          employeeCode: result.employeeCode,
          roles: result.roles || []
        };
        return true;
      }

      throw new UnauthorizedException('Invalid token');
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
