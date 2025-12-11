import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

// AsyncLocalStorage is available in Node.js 13.10.0+
let AsyncLocalStorageClass: any;
try {
  AsyncLocalStorageClass = require('async_hooks').AsyncLocalStorage;
} catch (e) {
  // Fallback for older Node versions
  AsyncLocalStorageClass = class {
    run<T>(store: any, callback: () => T): T {
      return callback();
    }
    getStore(): any {
      return null;
    }
  };
}

/**
 * AsyncLocalStorage để lưu user context
 */
export const userContextStorage = new AsyncLocalStorageClass();

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType();
    
    let userId: string | null = null;
    
    if (contextType === 'http') {
      try {
        const request = context.switchToHttp().getRequest();
        if (request) {
          userId = request.user?.id || 
                   request.user?.userId ||
                   request.headers?.['x-user-id'] || 
                   request.query?.userId ||
                   null;
        }
      } catch (e) {
        // Ignore errors
      }
    } else if (contextType === 'rpc') {
      // gRPC context - skip user context for now
      userId = null;
    }
    
    if (userId) {
      return userContextStorage.run({ userId }, () => next.handle());
    }
    
    return next.handle();
  }
}

