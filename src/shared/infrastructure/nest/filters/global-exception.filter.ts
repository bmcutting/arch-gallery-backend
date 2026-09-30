import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import type { Request } from 'express';
import { levelForStatus } from '../../logging/log-level';
import { userIdFrom } from '../../logging/request-user';

@Catch()
export class GlobalExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const request = host.switchToHttp().getRequest<Request>();
    const context = {
      method: request.method,
      url: request.url,
      userId: userIdFrom(request),
    };

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const payload = {
        ...context,
        statusCode,
        detail: this.extractDetail(exception),
      };

      if (levelForStatus(statusCode) === 'error') {
        this.logger.error(
          { ...payload, stack: exception.stack },
          'Unhandled HttpException (5xx)',
        );
      } else {
        this.logger.warn(payload, 'HttpException');
      }
    } else {
      const error = exception instanceof Error ? exception : undefined;
      this.logger.error(
        {
          ...context,
          statusCode: 500,
          detail: error ? error.message : String(exception),
        },
        'Unhandled exception',
      );
    }

    super.catch(exception, host);
  }

  private extractDetail(exception: HttpException): unknown {
    const response = exception.getResponse();
    if (typeof response === 'string') return response;

    const { message } = response as { message?: unknown };
    return message ?? response;
  }
}
