import { describe, it, expect } from 'vitest';
import {
  REDACT_PATHS,
  sanitizeUrl,
} from 'src/shared/infrastructure/logging/redact';

describe('sanitizeUrl', () => {
  it('devuelve intacta una URL sin query string', () => {
    expect(sanitizeUrl('/projects')).toBe('/projects');
    expect(sanitizeUrl('')).toBe('');
  });

  it('enmascara los parametros sensibles', () => {
    expect(sanitizeUrl('/projects?token=abc123')).toBe(
      '/projects?token=[REDACTED]',
    );
    expect(sanitizeUrl('/projects?secret=abc')).toBe(
      '/projects?secret=[REDACTED]',
    );
    expect(sanitizeUrl('/auth?password=hunter2')).toBe(
      '/auth?password=[REDACTED]',
    );
  });

  it('enmascara los tokens en snake_case, que es como los declara la API', () => {
    expect(sanitizeUrl('/auth?refresh_token=abc')).toBe(
      '/auth?refresh_token=[REDACTED]',
    );
    expect(sanitizeUrl('/auth?access_token=abc')).toBe(
      '/auth?access_token=[REDACTED]',
    );
  });

  it('ignora la capitalizacion de la clave', () => {
    expect(sanitizeUrl('/projects?TOKEN=abc')).toBe(
      '/projects?TOKEN=[REDACTED]',
    );
  });

  it('deja visibles los parametros que no son secretos', () => {
    expect(sanitizeUrl('/projects?page=2&limit=20')).toBe(
      '/projects?page=2&limit=20',
    );
  });

  it('enmascara solo el parametro sensible de una query mixta', () => {
    expect(sanitizeUrl('/projects?page=2&token=abc&limit=20')).toBe(
      '/projects?page=2&token=[REDACTED]&limit=20',
    );
  });

  it('no rompe con un parametro sin valor', () => {
    expect(sanitizeUrl('/projects?flag&page=2')).toBe('/projects?flag&page=2');
  });
});

describe('REDACT_PATHS', () => {
  it('cubre la cabecera Authorization y las cookies', () => {
    expect(REDACT_PATHS).toContain('req.headers.authorization');
    expect(REDACT_PATHS).toContain('req.headers.cookie');
    expect(REDACT_PATHS).toContain('res.headers["set-cookie"]');
  });

  it('cubre los tokens en snake_case en cualquier profundidad', () => {
    // Las rutas en camelCase de otros proyectos serian un no-op aqui: los DTO
    // de authentication declaran `refresh_token` y `access_token`.
    expect(REDACT_PATHS).toContain('*.refresh_token');
    expect(REDACT_PATHS).toContain('*.access_token');
  });

  it('cubre los parametros del SQL de un QueryFailedError', () => {
    // TypeORM loguea la sentencia y sus parametros; los parametros de un INSERT
    // sobre `user` incluirian el hash de la contrasena.
    expect(REDACT_PATHS).toContain('err.parameters');
    expect(REDACT_PATHS).toContain('err.driverError.parameters');
  });

  it('deja fuera el email y el nombre, que son publicos en esta API', () => {
    expect(REDACT_PATHS).not.toContain('req.body.email');
    expect(REDACT_PATHS.some((path) => path.includes('email'))).toBe(false);
    expect(REDACT_PATHS.some((path) => path.includes('name'))).toBe(false);
  });
});
