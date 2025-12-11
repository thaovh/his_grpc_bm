import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertDatesToISO } from '../utils/date-converter.util';
import { Reflector } from '@nestjs/core';
import { SKIP_TRANSFORM_KEY } from '../../events/events.controller';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    // Check if SkipTransform metadata is set
    const skipTransform = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const url = request.url;

    // Fallback: Skip transformation for health check and SSE endpoints via URL
    if (
      skipTransform ||
      url.includes('/healthz') ||
      url.includes('/events/stream')
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // Skip transformation if data is already a transformed response
        if (data && typeof data === 'object' && 'statusCode' in data && 'timestamp' in data) {
          return data;
        }

        // Convert all Date objects to ISO 8601 strings recursively
        const transformedData = convertDatesToISO(data);

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'Success',
          data: transformedData,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
