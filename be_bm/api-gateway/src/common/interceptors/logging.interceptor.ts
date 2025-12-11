import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PinoLogger } from 'nestjs-pino';
import { Reflector } from '@nestjs/core';
import { SKIP_TRANSFORM_KEY } from '../../events/events.controller';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: PinoLogger,
    private reflector: Reflector,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Check if SkipTransform metadata is set
    const skipLogging = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    // Skip logging for health check and SSE endpoints to avoid noise
    if (
      skipLogging ||
      url.includes('/healthz') ||
      url.includes('/events/stream')
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const delay = Date.now() - now;

        this.logger.info({
          method,
          url,
          statusCode,
          delay: `${delay}ms`,
          query,
          params,
          body: method !== 'GET' ? body : undefined,
        });
      }),
    );
  }
}
