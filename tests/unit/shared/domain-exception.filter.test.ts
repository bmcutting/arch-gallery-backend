import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Logger } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import { DomainExceptionFilter } from 'src/shared/infrastructure/nest/filters/domain-exception.filter';
import {
  DomainException,
  DomainErrorCode,
} from 'src/shared/domain/exceptions/domain.exception';
import { NotFoundException } from 'src/shared/domain/exceptions/not-found.exception';
import { ConflictException } from 'src/shared/domain/exceptions/conflict.exception';
import { ForbiddenException } from 'src/shared/domain/exceptions/forbidden.exception';
import { UnauthorizedException } from 'src/shared/domain/exceptions/unauthorized.exception';

describe('DomainExceptionFilter', () => {
  const filter = new DomainExceptionFilter();
  let status: ReturnType<typeof vi.fn>;
  let json: ReturnType<typeof vi.fn>;
  let host: ArgumentsHost;
  let warn: ReturnType<typeof vi.spyOn>;
  let logError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    logError = vi
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    json = vi.fn();
    status = vi.fn(() => ({ json }));
    host = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'POST',
          url: '/projects',
          user: { id: '01M3R49RS764YCWZ6SMQ7KNH5H' },
        }),
        getResponse: () => ({ status }),
      }),
    } as unknown as ArgumentsHost;
  });

  it.each([
    ['NotFoundException', new NotFoundException({ message: 'not-found' }), 404],
    ['ConflictException', new ConflictException({ message: 'conflict' }), 409],
    [
      'ForbiddenException',
      new ForbiddenException({ message: 'forbidden' }),
      403,
    ],
    [
      'UnauthorizedException',
      new UnauthorizedException({ message: 'unauthorized' }),
      401,
    ],
  ])('traduce %s a %i', (_name, exception, expectedStatus) => {
    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(expectedStatus);
    expect(json).toHaveBeenCalledWith({
      statusCode: expectedStatus,
      message: exception.message,
    });
  });

  it('incluye `field` cuando la excepción lo lleva', () => {
    filter.catch(
      new ConflictException({ message: 'repeat-email', field: 'email' }),
      host,
    );

    expect(json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'repeat-email',
      field: 'email',
    });
  });

  it('omite la clave `field` cuando no hay campo', () => {
    filter.catch(new NotFoundException({ message: 'not-found' }), host);

    expect(json.mock.calls[0][0]).not.toHaveProperty('field');
  });

  it('cae a 500 ante un código desconocido', () => {
    filter.catch(new WeirdException({ message: 'boom' }), host);

    expect(status).toHaveBeenCalledWith(500);
  });

  it('loguea el motivo como warn en un 4xx', () => {
    filter.catch(new NotFoundException({ message: 'no existe' }), host);

    expect(logError).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: '/projects',
        statusCode: 404,
        code: 'NOT_FOUND',
        detail: 'no existe',
        userId: '01M3R49RS764YCWZ6SMQ7KNH5H',
      }),
      expect.any(String),
    );
  });

  it('loguea como error el 500 del código desconocido', () => {
    // Nivel fijo en `warn` seria el mismo fallo que traia `pino-http` de serie:
    // un 500 pasando por INFO/WARN no se puede alertar ni filtrar.
    filter.catch(new WeirdException({ message: 'boom' }), host);

    expect(warn).not.toHaveBeenCalled();
    expect(logError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 500, detail: 'boom' }),
      expect.any(String),
    );
  });

  it('incluye el campo en el log cuando la excepción lo lleva', () => {
    filter.catch(
      new ConflictException({ message: 'repetido', field: 'email' }),
      host,
    );

    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({ field: 'email' }),
      expect.any(String),
    );
  });
});

class WeirdException extends DomainException {
  readonly code = 'WHATEVER' as DomainErrorCode;
}
