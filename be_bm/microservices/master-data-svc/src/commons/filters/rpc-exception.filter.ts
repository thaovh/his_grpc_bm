import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

/**
 * Global RPC Exception Filter for Microservices.
 * Converts regular Errors and TypeORM errors into RpcExceptions.
 */
@Catch()
export class GlobalRpcExceptionFilter implements RpcExceptionFilter<any> {
    constructor(private readonly logger: Logger) { }

    catch(exception: any, host: ArgumentsHost): Observable<any> {
        this.logger.error('GlobalRpcExceptionFilter caught exception', {
            message: exception.message,
            stack: exception.stack,
            constructor: exception.constructor?.name,
        });

        let rpcError: any;

        if (exception instanceof RpcException) {
            rpcError = exception.getError();
        } else if (typeof exception === 'object' && exception !== null && exception.code !== undefined) {
            // Handle objects that look like gRPC errors or RpcExceptions that failed instanceof check
            rpcError = {
                code: exception.code,
                message: exception.message || exception.details || 'Internal server error',
            };
        } else {
            // Handle TypeORM errors or generic Errors
            const message = exception.message || 'Internal server error';
            let code = 13; // INTERNAL

            // Map common error types to gRPC codes
            if (exception.name === 'EntityNotFoundError' || message.includes('not found')) {
                code = 5; // NOT_FOUND
            } else if (exception.code === '23505' || message.includes('already exists')) {
                // Postgres unique violation or common message
                code = 6; // ALREADY_EXISTS
            } else if (exception.name === 'QueryFailedError' && exception.message.includes('unique constraint')) {
                // Oracle/Generic unique violation
                code = 6; // ALREADY_EXISTS
            }

            rpcError = {
                code,
                message,
            };
        }

        return throwError(() => rpcError);
    }
}
