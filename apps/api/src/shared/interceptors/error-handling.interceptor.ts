import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DomainError } from '../errors/domain.error';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorHandlingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        this.logger.error(`Error occurred: ${error.message}`, error.stack);

        // Handle domain errors
        if (error instanceof DomainError) {
          return throwError(() => new HttpException(
            {
              success: false,
              message: error.message,
              statusCode: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST
          ));
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
          return throwError(() => new HttpException(
            {
              success: false,
              message: 'Validation failed',
              errors: error.details,
              statusCode: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST
          ));
        }

        // Handle Prisma errors
        if (error.code === 'P2002') {
          return throwError(() => new HttpException(
            {
              success: false,
              message: 'Resource already exists',
              statusCode: HttpStatus.CONFLICT,
            },
            HttpStatus.CONFLICT
          ));
        }

        if (error.code === 'P2025') {
          return throwError(() => new HttpException(
            {
              success: false,
              message: 'Resource not found',
              statusCode: HttpStatus.NOT_FOUND,
            },
            HttpStatus.NOT_FOUND
          ));
        }

        // Handle HTTP exceptions
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // Handle unknown errors
        return throwError(() => new HttpException(
          {
            success: false,
            message: 'Internal server error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        ));
      })
    );
  }
}