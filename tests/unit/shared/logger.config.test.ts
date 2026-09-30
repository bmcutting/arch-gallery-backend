import { describe, it, expect, vi } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Options } from 'pino-http';
import { createPinoConfig } from 'src/shared/infrastructure/logging/logger.config';
import { REDACT_PATHS } from 'src/shared/infrastructure/logging/redact';
import type { EnvService } from 'src/env/services/env';

const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;

// `createPinoConfig` recibe el servicio por parametro, asi que el test le pasa
// un objeto plano: no hay que tocar `process.env` ni recompilar el modulo.
function env(overrides: Partial<EnvService> = {}): EnvService {
  return {
    NODE_ENV: 'local',
    LOG_LEVEL: 'info',
    LOG_HEALTHCHECK: false,
    ...overrides,
  } as EnvService;
}

function options(service: EnvService): Options {
  return createPinoConfig(service).pinoHttp as Options;
}

function request(overrides: Record<string, unknown> = {}): IncomingMessage {
  return {
    method: 'GET',
    url: '/projects',
    headers: {},
    ...overrides,
  } as unknown as IncomingMessage;
}

function response(statusCode = 200) {
  const setHeader = vi.fn();
  return {
    res: { statusCode, setHeader } as unknown as ServerResponse,
    setHeader,
  };
}

describe('createPinoConfig', () => {
  it('usa pino-pretty solo en local', () => {
    expect(options(env({ NODE_ENV: 'local' })).transport).toMatchObject({
      target: 'pino-pretty',
    });
    expect(options(env({ NODE_ENV: 'development' })).transport).toBeUndefined();
    expect(options(env({ NODE_ENV: 'production' })).transport).toBeUndefined();
  });

  it('toma el nivel de LOG_LEVEL', () => {
    expect(options(env({ LOG_LEVEL: 'debug' })).level).toBe('debug');
  });

  it('enchufa las rutas de redaccion', () => {
    expect(options(env()).redact).toMatchObject({
      paths: REDACT_PATHS,
      censor: '[REDACTED]',
      remove: false,
    });
  });

  describe('genReqId', () => {
    it('reutiliza el x-request-id que llega y lo devuelve en la respuesta', () => {
      const { res, setHeader } = response();
      const incoming = '01K69TQ8M4ZC7R3VX0Y1B2D5FG';

      const id = options(env()).genReqId!(
        request({ headers: { 'x-request-id': incoming } }),
        res,
      );

      expect(id).toBe(incoming);
      expect(setHeader).toHaveBeenCalledWith('x-request-id', incoming);
    });

    it('genera un ULID cuando no llega y lo devuelve en la respuesta', () => {
      const { res, setHeader } = response();

      const id = options(env()).genReqId!(request(), res) as string;

      expect(id).toMatch(ULID_PATTERN);
      expect(setHeader).toHaveBeenCalledWith('x-request-id', id);
    });

    it('ignora un x-request-id vacio y genera uno nuevo', () => {
      const { res } = response();

      const id = options(env()).genReqId!(
        request({ headers: { 'x-request-id': '' } }),
        res,
      ) as string;

      expect(id).toMatch(ULID_PATTERN);
    });
  });

  describe('autoLogging.ignore', () => {
    const ignore = (service: EnvService, url: string) => {
      const autoLogging = options(service).autoLogging as {
        ignore: (req: IncomingMessage) => boolean;
      };
      return autoLogging.ignore(request({ url }));
    };

    it('silencia el healthcheck por defecto', () => {
      expect(ignore(env(), '/healthcheck')).toBe(true);
    });

    it('silencia el healthcheck aunque traiga query string', () => {
      expect(ignore(env(), '/healthcheck?verbose=1')).toBe(true);
    });

    it('deja de silenciarlo con LOG_HEALTHCHECK=true', () => {
      expect(ignore(env({ LOG_HEALTHCHECK: true }), '/healthcheck')).toBe(
        false,
      );
    });

    it('no silencia el resto de rutas', () => {
      expect(ignore(env(), '/projects')).toBe(false);
      expect(ignore(env(), '/healthcheck-extra')).toBe(false);
    });
  });

  describe('customProps', () => {
    it('saca el userId del string plano que deja JwtAuthGuard', () => {
      const { res } = response();
      const user = { id: '01K69TQ8M4ZC7R3VX0Y1B2D5FG' };

      expect(options(env()).customProps!(request({ user }), res)).toEqual({
        userId: user.id,
      });
    });

    it('devuelve null en una peticion sin autenticar', () => {
      const { res } = response();

      expect(options(env()).customProps!(request(), res)).toEqual({
        userId: null,
      });
    });
  });

  describe('customLogLevel', () => {
    const level = (statusCode: number, error?: Error) =>
      options(env()).customLogLevel!(
        request(),
        response(statusCode).res,
        error,
      );

    it('marca los 5xx como error', () => {
      expect(level(500)).toBe('error');
      expect(level(503)).toBe('error');
    });

    it('marca los 4xx como warn', () => {
      // Sin customLogLevel, pino-http cae a useLevel ('info') y un 500 se
      // loguearia como INFO: LOG_LEVEL=warn silenciaria todos los errores.
      expect(level(400)).toBe('warn');
      expect(level(401)).toBe('warn');
      expect(level(404)).toBe('warn');
    });

    it('deja los 2xx y 3xx en info', () => {
      expect(level(200)).toBe('info');
      expect(level(302)).toBe('info');
    });

    it('marca como error cualquier status si llega un error real', () => {
      expect(level(200, new Error('socket roto'))).toBe('error');
    });
  });

  describe('customErrorObject', () => {
    const syntheticFor = (statusCode: number) =>
      new Error(`failed with status code ${statusCode}`);

    it('descarta el err que pino-http se inventa en los 500', () => {
      const { res } = response(500);
      const error = syntheticFor(500);

      const result = options(env()).customErrorObject!(request(), res, error, {
        err: error,
        responseTime: 21,
      }) as Record<string, unknown>;

      expect(result).not.toHaveProperty('err');
      expect(result).toHaveProperty('responseTime', 21);
    });

    it('conserva un error real de stream', () => {
      const { res } = response(500);
      const error = new Error('ECONNRESET');
      const value = { err: error, responseTime: 8 };

      expect(
        options(env()).customErrorObject!(request(), res, error, value),
      ).toBe(value);
    });
  });

  describe('mensajes', () => {
    it('produce METODO /ruta STATUS Xms y enmascara la query', () => {
      const { res } = response(200);

      expect(
        options(env()).customSuccessMessage!(
          request({ url: '/projects?token=abc' }),
          res,
          15,
        ),
      ).toBe('GET /projects?token=[REDACTED] 200 15ms');
    });

    it('no arrastra la cola "error: failed with status code N" en los 500', () => {
      const { res } = response(500);

      expect(
        options(env()).customErrorMessage!(
          request({ url: '/likes/01ZZZ' }),
          res,
          new Error('failed with status code 500'),
        ),
      ).toBe('GET /likes/01ZZZ 500');
    });

    it('incluye el mensaje del error y enmascara la query', () => {
      const { res } = response(500);

      expect(
        options(env()).customErrorMessage!(
          request({ url: '/projects?token=abc' }),
          res,
          new Error('boom'),
        ),
      ).toBe('GET /projects?token=[REDACTED] 500 error: boom');
    });
  });

  describe('serializers', () => {
    it('recorta req a id, method, url y headers, con la url enmascarada', () => {
      const serializers = options(env()).serializers!;
      const req = request({ url: '/projects?token=abc', id: 'req-1' });

      expect(serializers.req(req)).toEqual({
        id: 'req-1',
        method: 'GET',
        url: '/projects?token=[REDACTED]',
        headers: {},
      });
    });

    it('recorta res a statusCode', () => {
      const serializers = options(env()).serializers!;

      expect(serializers.res(response(404).res)).toEqual({ statusCode: 404 });
    });
  });
});
