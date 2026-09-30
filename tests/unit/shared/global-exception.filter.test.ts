import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ArgumentsHost,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GlobalExceptionFilter } from 'src/shared/infrastructure/nest/filters/global-exception.filter';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let host: ArgumentsHost;
  let warn: ReturnType<typeof vi.spyOn>;
  let error: ReturnType<typeof vi.spyOn>;
  let delegated: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    host = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'POST',
          url: '/projects',
          user: { id: '01M3R49RS764YCWZ6SMQ7KNH5H' },
        }),
      }),
    } as unknown as ArgumentsHost;

    warn = vi
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    error = vi
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
    // La respuesta la sigue escribiendo BaseExceptionFilter: este filtro solo
    // loguea, asi que no cambia el cuerpo de ningun error.
    delegated = vi
      .spyOn(BaseExceptionFilter.prototype, 'catch')
      .mockImplementation(() => undefined);
  });

  it('delega siempre la respuesta en BaseExceptionFilter', () => {
    const exception = new ForbiddenException('nope');

    filter.catch(exception, host);

    expect(delegated).toHaveBeenCalledWith(exception, host);
  });

  it('loguea un 4xx como warn, con metodo, ruta y status', () => {
    filter.catch(new ForbiddenException('nope'), host);

    expect(error).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: '/projects',
        statusCode: 403,
      }),
      expect.any(String),
    );
  });

  it('lleva el userId real, no el null que Pino trae ligado', () => {
    // El logger con contexto de peticion se crea antes de que corra el guard,
    // asi que su `userId` vale null incluso estando autenticado. Pasarlo en el
    // objeto del log lo pisa.
    filter.catch(new ForbiddenException('nope'), host);

    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({ userId: '01M3R49RS764YCWZ6SMQ7KNH5H' }),
      expect.any(String),
    );
  });

  it('saca el detalle de getResponse, no de exception.message', () => {
    // `message` de una BadRequestException del ValidationPipe es el literal
    // 'Bad Request Exception'; el array de class-validator vive en getResponse.
    filter.catch(
      new BadRequestException(['property foo should not exist']),
      host,
    );

    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({ detail: ['property foo should not exist'] }),
      expect.any(String),
    );
  });

  it('acepta un getResponse en forma de cadena', () => {
    filter.catch(new BadRequestException(), host);

    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({ detail: 'Bad Request' }),
      expect.any(String),
    );
  });

  it('loguea un 5xx como error y con stack', () => {
    filter.catch(new InternalServerErrorException('boom'), host);

    expect(warn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        stack: expect.any(String) as string,
      }),
      expect.any(String),
    );
  });

  it('loguea como error una excepcion que no es HttpException', () => {
    filter.catch(new TypeError('no se puede'), host);

    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: '/projects',
        statusCode: 500,
        detail: 'no se puede',
      }),
      expect.any(String),
    );
  });

  it('no duplica el stack de lo que ya loguea ExceptionsHandler', () => {
    // BaseExceptionFilter loguea por su cuenta las excepciones que no son
    // HttpException, con stack y objeto de error completo. Repetirlo aqui
    // imprimiria la misma traza dos veces por cada 500.
    filter.catch(new TypeError('no se puede'), host);

    const payload = error.mock.calls[0][0] as Record<string, unknown>;
    expect(payload).not.toHaveProperty('stack');
  });

  it('no revienta con algo que no es un Error', () => {
    filter.catch('fallo en crudo', host);

    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({ detail: 'fallo en crudo' }),
      expect.any(String),
    );
  });
});
