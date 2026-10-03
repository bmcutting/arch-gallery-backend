import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ArgumentsHost,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GlobalExceptionFilter } from 'src/shared/infrastructure/nest/filters/global-exception.filter';

const USER_ID = '01M3R49RS764YCWZ6SMQ7KNH5H';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let host: ArgumentsHost;
  let status: ReturnType<typeof vi.fn>;
  let json: ReturnType<typeof vi.fn>;
  let warn: ReturnType<typeof vi.spyOn>;
  let error: ReturnType<typeof vi.spyOn>;

  const body = () =>
    (json.mock.calls[0] as unknown[])[0] as Record<string, unknown>;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    json = vi.fn();
    status = vi.fn(() => ({ json }));
    host = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'POST',
          url: '/projects',
          user: { id: USER_ID },
        }),
        getResponse: () => ({ status }),
      }),
    } as unknown as ArgumentsHost;

    warn = vi
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    error = vi
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
  });

  describe('cuerpo de la respuesta', () => {
    it('responde { statusCode, message } y nada más', () => {
      filter.catch(new ForbiddenException('not-resource-owner'), host);

      expect(status).toHaveBeenCalledWith(403);
      expect(body()).toEqual({
        statusCode: 403,
        message: 'not-resource-owner',
      });
    });

    it('no incluye el campo `error` de Nest', () => {
      // Es lo que hacía conviviendo dos formas de cuerpo de error.
      filter.catch(new ForbiddenException('nope'), host);

      expect(body()).not.toHaveProperty('error');
    });

    it('conserva el array de mensajes de una validación', () => {
      filter.catch(
        new BadRequestException(['property foo should not exist']),
        host,
      );

      expect(body()).toEqual({
        statusCode: 400,
        message: ['property foo should not exist'],
      });
    });

    it('acepta un getResponse en forma de cadena', () => {
      filter.catch(new BadRequestException(), host);

      expect(body()).toEqual({ statusCode: 400, message: 'Bad Request' });
    });

    it('propaga `field` cuando la respuesta lo trae', () => {
      filter.catch(
        new BadRequestException({ message: 'repeat-user', field: 'email' }),
        host,
      );

      expect(body()).toEqual({
        statusCode: 400,
        message: 'repeat-user',
        field: 'email',
      });
    });

    it('responde un mensaje genérico a lo que no es HttpException', () => {
      // El detalle del fallo está en el log; al cliente no le sale.
      filter.catch(new TypeError('no se puede: /etc/secreto'), host);

      expect(status).toHaveBeenCalledWith(500);
      expect(body()).toEqual({ statusCode: 500, message: 'internal-error' });
    });
  });

  describe('log', () => {
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
      filter.catch(new ForbiddenException('nope'), host);

      expect(warn).toHaveBeenCalledWith(
        expect.objectContaining({ userId: USER_ID }),
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

    it('loguea con stack lo que no es HttpException', () => {
      // Antes lo hacía `ExceptionsHandler` al delegar; ahora es cosa suya.
      filter.catch(new TypeError('no se puede'), host);

      expect(error).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/projects',
          statusCode: 500,
          detail: 'no se puede',
          stack: expect.any(String) as string,
        }),
        expect.any(String),
      );
    });

    it('no revienta con algo que no es un Error', () => {
      filter.catch('fallo en crudo', host);

      expect(error).toHaveBeenCalledWith(
        expect.objectContaining({ detail: 'fallo en crudo', stack: undefined }),
        expect.any(String),
      );
      expect(body()).toEqual({ statusCode: 500, message: 'internal-error' });
    });
  });
});
