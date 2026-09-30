import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { levelForStatus } from '../../logging/log-level';
import { userIdFrom } from '../../logging/request-user';
import {
  DomainException,
  DomainErrorCode,
} from 'src/shared/domain/exceptions/domain.exception';

const STATUS_BY_CODE: Record<DomainErrorCode, number> = {
  [DomainErrorCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [DomainErrorCode.CONFLICT]: HttpStatus.CONFLICT,
  [DomainErrorCode.FORBIDDEN]: HttpStatus.FORBIDDEN,
  [DomainErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
};

/**
 * Traduce las excepciones de dominio a respuestas HTTP a partir de su `code`.
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const statusCode =
      STATUS_BY_CODE[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const payload = {
      method: request.method,
      url: request.url,
      userId: userIdFrom(request),
      statusCode,
      code: exception.code,
      detail: exception.message,
      ...(exception.field ? { field: exception.field } : {}),
    };

    // Un `code` desconocido cae a 500, asi que el nivel no puede ser `warn`
    // fijo: seria el mismo fallo que `pino-http` traia de serie.
    if (levelForStatus(statusCode) === 'error') {
      this.logger.error(payload, 'DomainException');
    } else {
      this.logger.warn(payload, 'DomainException');
    }

    response.status(statusCode).json({
      statusCode,
      message: exception.message,
      ...(exception.field ? { field: exception.field } : {}),
    });
  }
}
