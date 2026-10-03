import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { levelForStatus } from '../../logging/log-level';
import { userIdFrom } from '../../logging/request-user';

interface ErrorBody {
  statusCode: number;
  message: unknown;
  field?: string;
}

/**
 * Loguea toda excepción del borde HTTP y escribe la respuesta con la misma forma
 * que `DomainExceptionFilter`: `{ statusCode, message, field? }`.
 *
 * Antes delegaba en `BaseExceptionFilter`, lo que dejaba dos formas de cuerpo de
 * error conviviendo según quién respondiera.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const context = {
      method: request.method,
      url: request.url,
      userId: userIdFrom(request),
    };

    const body =
      exception instanceof HttpException
        ? this.fromHttpException(exception, context)
        : this.fromUnknown(exception, context);

    response.status(body.statusCode).json(body);
  }

  private fromHttpException(
    exception: HttpException,
    context: object,
  ): ErrorBody {
    const statusCode = exception.getStatus();
    const body = this.extractBody(exception, statusCode);
    const payload = { ...context, statusCode, detail: body.message };

    if (levelForStatus(statusCode) === 'error') {
      this.logger.error(
        { ...payload, stack: exception.stack },
        'Unhandled HttpException (5xx)',
      );
    } else {
      this.logger.warn(payload, 'HttpException');
    }

    return body;
  }

  private fromUnknown(exception: unknown, context: object): ErrorBody {
    const error = exception instanceof Error ? exception : undefined;

    this.logger.error(
      {
        ...context,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        detail: error ? error.message : String(exception),
        stack: error?.stack,
      },
      'Unhandled exception',
    );

    // Mensaje genérico: lo que falló ya está en el log y no tiene por qué salir
    // al cliente.
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'internal-error',
    };
  }

  private extractBody(exception: HttpException, statusCode: number): ErrorBody {
    const response = exception.getResponse();
    if (typeof response === 'string') return { statusCode, message: response };

    const { message, field } = response as {
      message?: unknown;
      field?: unknown;
    };

    return {
      statusCode,
      // El `message` de un 400 de validación es un array de strings y se
      // conserva tal cual.
      message: message ?? response,
      ...(typeof field === 'string' ? { field } : {}),
    };
  }
}
