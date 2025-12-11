import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;
    
    // Skip transformation for health check endpoint
    if (path === '/api/healthz' || path === '/healthz') {
      return next.handle();
    }
    
    return next.handle().pipe(
      map((data) => {
        // Skip transformation if data is already a transformed response
        if (data && typeof data === 'object' && 'statusCode' in data && 'timestamp' in data) {
          return data;
        }
        
        // Convert all Date objects to ISO 8601 strings recursively
        const transformedData = this.convertDatesToISO(data);
        
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'Success',
          data: transformedData,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  /**
   * Recursively convert Date objects and date strings to ISO 8601 strings
   * Handles objects, arrays, and nested structures
   */
  private convertDatesToISO(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    // If it's a Date object, convert to ISO string
    if (obj instanceof Date) {
      return obj.toISOString();
    }

    // If it's a string that looks like a date (from gRPC or database)
    // Check for common date patterns and convert to ISO
    if (typeof obj === 'string') {
      // Check if it's a date string (not already ISO format)
      // Patterns: "Thu Dec 11 2025 08:05:36 GMT+0700", "2025-12-11T...", etc.
      if (obj.includes('GMT') || obj.includes('GMT+') || obj.includes('GMT-')) {
        // It's a locale date string, convert to ISO
        const date = new Date(obj);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      }
      // If already ISO format or other string, return as is
      return obj;
    }

    // If it's an array, map over each element
    if (Array.isArray(obj)) {
      return obj.map(item => this.convertDatesToISO(item));
    }

    // If it's an object (but not Date), recursively convert properties
    if (typeof obj === 'object') {
      const converted: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          converted[key] = this.convertDatesToISO(obj[key]);
        }
      }
      return converted;
    }

    // For primitives (number, boolean), return as is
    return obj;
  }
}

