import { describe, it, expect } from 'vitest';
import { durationToSeconds } from 'src/shared/infrastructure/utils/duration';

describe('durationToSeconds', () => {
  it('convierte cada unidad', () => {
    expect(durationToSeconds('45s')).toBe(45);
    expect(durationToSeconds('15m')).toBe(900);
    expect(durationToSeconds('12h')).toBe(43200);
    expect(durationToSeconds('30d')).toBe(2592000);
  });

  it('tolera espacios alrededor', () => {
    expect(durationToSeconds('  1d  ')).toBe(86400);
  });

  it.each([
    ['1día', 'unidad desconocida'],
    ['1w', 'semanas no están contempladas'],
    ['d', 'sin número'],
    ['10', 'sin unidad'],
    ['0d', 'cero'],
    ['-1d', 'negativo'],
    ['1.5d', 'decimal'],
    ['', 'vacío'],
  ])('lanza con %s (%s)', (value) => {
    // Lanza en vez de caer a un defecto porque lo llama `EnvService`: así un
    // valor mal escrito rompe el arranque y no la caducidad de los tokens.
    expect(() => durationToSeconds(value)).toThrow();
  });
});
