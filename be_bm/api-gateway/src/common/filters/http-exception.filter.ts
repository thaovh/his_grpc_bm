import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { translateError } from '../constants/error-codes';

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
  error?: string | object;
}

/**
 * Mapping gRPC status codes to HTTP status codes
 */
const GrpcToHttpStatus: Record<number, number> = {
  1: HttpStatus.REQUEST_TIMEOUT, // CANCELLED -> 499 (mapped to 408 for simplicity)
  2: HttpStatus.INTERNAL_SERVER_ERROR, // UNKNOWN
  3: HttpStatus.BAD_REQUEST, // INVALID_ARGUMENT
  4: HttpStatus.GATEWAY_TIMEOUT, // DEADLINE_EXCEEDED
  5: HttpStatus.NOT_FOUND, // NOT_FOUND
  6: HttpStatus.CONFLICT, // ALREADY_EXISTS
  7: HttpStatus.FORBIDDEN, // PERMISSION_DENIED
  8: HttpStatus.TOO_MANY_REQUESTS, // RESOURCE_EXHAUSTED
  9: HttpStatus.BAD_REQUEST, // FAILED_PRECONDITION
  10: HttpStatus.CONFLICT, // ABORTED
  11: HttpStatus.BAD_REQUEST, // OUT_OF_RANGE
  12: HttpStatus.NOT_IMPLEMENTED, // UNIMPLEMENTED
  13: HttpStatus.INTERNAL_SERVER_ERROR, // INTERNAL
  14: HttpStatus.SERVICE_UNAVAILABLE, // UNAVAILABLE
  15: HttpStatus.INTERNAL_SERVER_ERROR, // DATA_LOSS
  16: HttpStatus.UNAUTHORIZED, // UNAUTHENTICATED
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Log error details for debugging
    let debugInfo = `Timestamp: ${new Date().toISOString()}\nPath: ${request.url}\nMethod: ${request.method}\nException: ${JSON.stringify(exception)}\n`;
    if (exception instanceof Error) {
      debugInfo += `Stack: ${exception.stack}\n`;
    }
    const fs = require('fs');
    fs.appendFileSync('debug-api.log', debugInfo + '-------------------\n');

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorDetails: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = typeof res === 'object' ? res.message : res;
      errorDetails = typeof res === 'object' ? res.error : undefined;
    } else if (exception.code !== undefined && typeof exception.code === 'number') {
      // It's likely a gRPC error
      status = GrpcToHttpStatus[exception.code] || HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.details || exception.message || 'An error occurred';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Apply translation for the message
    const translatedMessage = Array.isArray(message)
      ? message.map((m) => translateError(m))
      : translateError(message);

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(translatedMessage) ? translatedMessage : [translatedMessage],
      error: errorDetails,
    };

    // Merge additional fields if exception is an object - REMOVED to prevent leaking internal details
    // Only return the standard ErrorResponse fields
    /*
    if (typeof exception === 'object' && exception !== null) {
      Object.keys(exception).forEach((key) => {
        if (!['message', 'error', 'statusCode', 'code', 'details'].includes(key)) {
          (errorResponse as any)[key] = exception[key];
        }
      });
    }
    */

    response.status(status).json(errorResponse);
  }
}

