import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

// AsyncLocalStorage is available in Node.js 13.10.0+
// For compatibility, we'll use a type assertion
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
 * Sử dụng để truyền user ID qua các async operations
 */
export const userContextStorage = new AsyncLocalStorageClass();

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Check context type
    const contextType = context.getType();
    
    let userId: string | null = null;
    
    if (contextType === 'http') {
      // HTTP context
      try {
        const request = context.switchToHttp().getRequest();
        if (request) {
          // Extract user ID from JWT token or request headers
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
      // Can be implemented later using gRPC metadata
      userId = null;
    }
    
    if (userId) {
      // Store user ID in AsyncLocalStorage for use in subscribers
      return userContextStorage.run({ userId }, () => next.handle());
    }
    
    // No user ID found, continue without context
    return next.handle();
  }
}

