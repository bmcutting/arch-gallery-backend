import { describe, it, expect } from 'vitest';
import { parseCorsOrigins } from 'src/shared/infrastructure/utils/cors';

describe('parseCorsOrigins', () => {
  it('devuelve "*" cuando no hay valor', () => {
    expect(parseCorsOrigins(undefined)).toBe('*');
    expect(parseCorsOrigins('')).toBe('*');
  });

  it('devuelve "*" cuando el valor es el literal "*"', () => {
    expect(parseCorsOrigins('*')).toBe('*');
    expect(parseCorsOrigins('  *  ')).toBe('*');
  });

  it('parte la lista por comas y recorta los espacios', () => {
    expect(
      parseCorsOrigins(' http://localhost:5173 , https://archgallery.app '),
    ).toEqual(['http://localhost:5173', 'https://archgallery.app']);
  });

  it('acepta un solo origen', () => {
    expect(parseCorsOrigins('http://localhost:5173')).toEqual([
      'http://localhost:5173',
    ]);
  });

  it('cae a "*" si la cadena solo tiene separadores', () => {
    // Si no cayera a "*" devolveria [] y el navegador bloquearia todo origen,
    // que es mas dificil de diagnosticar que permitirlos.
    expect(parseCorsOrigins(',,  ,')).toBe('*');
  });
});
