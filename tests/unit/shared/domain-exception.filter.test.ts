import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  beforeEach(() => {
    json = vi.fn();
    status = vi.fn(() => ({ json }));
    host = {
      switchToHttp: () => ({ getResponse: () => ({ status }) }),
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
    class WeirdException extends DomainException {
      readonly code = 'WHATEVER' as DomainErrorCode;
    }

    filter.catch(new WeirdException({ message: 'boom' }), host);

    expect(status).toHaveBeenCalledWith(500);
  });
});
