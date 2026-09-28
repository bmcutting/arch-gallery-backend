import { describe, it, expect } from 'vitest';
import { UlidGenerator } from 'src/shared/infrastructure/services/ulid.generator';

// El alfabeto Crockford base32 que usa ULID: sin I, L, O ni U.
const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;

describe('UlidGenerator', () => {
  const generator = new UlidGenerator();

  it('genera un identificador de 26 caracteres', () => {
    expect(generator.create()).toHaveLength(26);
  });

  it('usa el alfabeto de ULID', () => {
    expect(generator.create()).toMatch(ULID_PATTERN);
  });

  it('genera identificadores distintos', () => {
    expect(generator.create()).not.toBe(generator.create());
  });

  it('codifica el instante de creación en el prefijo, en orden creciente', async () => {
    // Es la propiedad que permite usarlos como cursor de paginación. Solo aplica
    // al prefijo de tiempo (10 chars): dentro del mismo milisegundo el sufijo es
    // aleatorio y `ulid()` no es monotónico.
    const first = generator.create();
    await new Promise((resolve) => setTimeout(resolve, 2));
    const second = generator.create();

    expect(second.slice(0, 10) > first.slice(0, 10)).toBe(true);
  });
});
