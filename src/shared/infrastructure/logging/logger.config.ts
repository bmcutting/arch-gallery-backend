import type { IncomingMessage, ServerResponse } from 'http';
import type { Params } from 'nestjs-pino';
import { ulid } from 'ulid';
import { EnvService } from 'src/env/services/env';
import { REDACT_PATHS, sanitizeUrl } from './redact';
import { levelForStatus } from './log-level';
import { userIdFrom } from './request-user';

export const HEALTHCHECK_PATH = 'healthcheck';

function isSyntheticError(error: Error, res: ServerResponse): boolean {
  return error.message === `failed with status code ${res.statusCode}`;
}

export function createPinoConfig(env: EnvService): Params {
  const isLocal = env.NODE_ENV === 'local';

  return {
    pinoHttp: {
      level: env.LOG_LEVEL,
      transport: isLocal
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: 'SYS:HH:MM:ss.l',
              ignore: 'pid,hostname,req,res,responseTime,context',
              // El bloque condicional evita un '[]' vacio en las lineas de
              // peticion, que no llevan 'context'.
              messageFormat: '{if context}[{context}] {end}{msg}',
            },
          }
        : undefined,
      redact: {
        paths: REDACT_PATHS,
        censor: '[REDACTED]',
        remove: false,
      },
      customLogLevel: (
        _req: IncomingMessage,
        res: ServerResponse,
        error?: Error,
      ) => (error ? 'error' : levelForStatus(res.statusCode)),
      autoLogging: {
        ignore: (req: IncomingMessage) =>
          !env.LOG_HEALTHCHECK &&
          (req.url ?? '').split('?')[0] === `/${HEALTHCHECK_PATH}`,
      },
      genReqId: (req: IncomingMessage, res: ServerResponse) => {
        const incoming = req.headers['x-request-id'];
        if (typeof incoming === 'string' && incoming.length > 0) {
          res.setHeader('x-request-id', incoming);
          return incoming;
        }

        const id = ulid();
        res.setHeader('x-request-id', id);
        return id;
      },
      customProps: (req: IncomingMessage) => ({ userId: userIdFrom(req) }),
      serializers: {
        req: (req: IncomingMessage & { id?: string }) => ({
          id: req.id,
          method: req.method,
          url: sanitizeUrl(req.url ?? ''),
          headers: req.headers,
        }),
        res: (res: ServerResponse) => ({
          statusCode: res.statusCode,
        }),
      },
      customErrorObject: (
        _req: IncomingMessage,
        res: ServerResponse,
        error: Error,
        value: Record<string, unknown>,
      ) => {
        if (!isSyntheticError(error, res)) return value;

        const rest = { ...value };
        delete rest.err;
        return rest;
      },
      customSuccessMessage: (
        req: IncomingMessage,
        res: ServerResponse,
        responseTime: number,
      ) =>
        `${req.method} ${sanitizeUrl(req.url ?? '')} ${res.statusCode} ${responseTime}ms`,
      customErrorMessage: (
        req: IncomingMessage,
        res: ServerResponse,
        error: Error,
      ) => {
        const prefix = `${req.method} ${sanitizeUrl(req.url ?? '')} ${res.statusCode}`;
        return isSyntheticError(error, res)
          ? prefix
          : `${prefix} error: ${error.message}`;
      },
    },
  };
}
