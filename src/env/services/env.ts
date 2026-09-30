import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const toBoolean = (value: string): boolean => value === 'true';

@Injectable()
export class EnvService {
  constructor(private readonly config: ConfigService) {}

  readonly NODE_ENV = this.config.getOrThrow<string>('NODE_ENV');
  readonly PORT = Number(this.config.getOrThrow<string>('PORT'));

  readonly DB_HOST = this.config.getOrThrow<string>('DB_HOST');
  readonly DB_PORT = Number(this.config.getOrThrow<string>('DB_PORT'));
  readonly DB_NAME = this.config.getOrThrow<string>('DB_NAME');
  readonly DB_USERNAME = this.config.getOrThrow<string>('DB_USERNAME');
  readonly DB_PASSWORD = this.config.getOrThrow<string>('DB_PASSWORD');

  readonly DB_SYNCHRONIZE = toBoolean(
    this.config.getOrThrow<string>('DB_SYNCHRONIZE'),
  );
  readonly DB_RUN_MIGRATIONS = toBoolean(
    this.config.getOrThrow<string>('DB_RUN_MIGRATIONS'),
  );
  readonly DB_DROP_SCHEMA = toBoolean(
    this.config.getOrThrow<string>('DB_DROP_SCHEMA'),
  );
  readonly DB_SSL = toBoolean(this.config.getOrThrow<string>('DB_SSL'));
  readonly DB_SSL_REJECT_UNAUTHORIZED = toBoolean(
    this.config.getOrThrow<string>('DB_SSL_REJECT_UNAUTHORIZED'),
  );

  readonly SWAGGER_ENABLED = toBoolean(
    this.config.getOrThrow<string>('SWAGGER_ENABLED'),
  );
  readonly FRONTEND_URL = this.config.getOrThrow<string>('FRONTEND_URL');
  readonly CORS_ORIGINS = this.config.get<string>('CORS_ORIGINS') ?? '';

  readonly JWT_SECRET = this.config.getOrThrow<string>('JWT_SECRET');
  readonly JWT_EXPIRATION_TIME = this.config.getOrThrow<string>(
    'JWT_EXPIRATION_TIME',
  );
  readonly JWT_ALGORITHM = this.config.getOrThrow<string>('JWT_ALGORITHM');
  readonly REFRESH_TOKEN_EXPIRATION_TIME = this.config.getOrThrow<string>(
    'REFRESH_TOKEN_EXPIRATION_TIME',
  );

  readonly LOG_LEVEL = this.config.getOrThrow<string>('LOG_LEVEL');
  readonly LOG_HEALTHCHECK = toBoolean(
    this.config.getOrThrow<string>('LOG_HEALTHCHECK'),
  );
}
