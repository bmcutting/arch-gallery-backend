import { describe, it, expect } from 'vitest';
import { APP_FILTER } from '@nestjs/core';
import { SharedModule } from 'src/shared/shared.module';
import { GlobalExceptionFilter } from 'src/shared/infrastructure/nest/filters/global-exception.filter';
import { DomainExceptionFilter } from 'src/shared/infrastructure/nest/filters/domain-exception.filter';

type FilterProvider = { provide: unknown; useClass: unknown };

function registeredFilters(): unknown[] {
  const providers =
    (Reflect.getMetadata('providers', SharedModule) as unknown[]) ?? [];

  return providers
    .filter(
      (provider): provider is FilterProvider =>
        typeof provider === 'object' &&
        provider !== null &&
        (provider as FilterProvider).provide === APP_FILTER,
    )
    .map((provider) => provider.useClass);
}

// Nest prueba los filtros en orden INVERSO al de registro:
// `router-exception-filters.js` hace `setCustomFilters(filters.reverse())` y
// `selectExceptionFilterMetadata` se queda con la primera coincidencia.
//
// Si se invierte este orden, el catch-all se prueba primero y se queda con las
// excepciones de dominio. Como `DomainException` no es una `HttpException`,
// `BaseExceptionFilter` las responderia con 500: los 404/409/403/401 de todo el
// proyecto pasarian a ser 500 sin que compile ni falle nada mas.
describe('orden de registro de los filtros en SharedModule', () => {
  it('registra los dos filtros', () => {
    expect(registeredFilters()).toHaveLength(2);
  });

  it('pone el catch-all primero para que se pruebe ultimo', () => {
    const filters = registeredFilters();

    expect(filters.indexOf(GlobalExceptionFilter)).toBeLessThan(
      filters.indexOf(DomainExceptionFilter),
    );
  });

  it('deja el catch-all sin @Catch() de tipo y el de dominio con el suyo', () => {
    // `@Catch()` sin argumentos es lo que lo vuelve catch-all; si alguien le
    // pone un tipo, deja de cubrir los fallos del body-parser.
    expect(
      Reflect.getMetadata('__filterCatchExceptions__', GlobalExceptionFilter),
    ).toEqual([]);
    expect(
      Reflect.getMetadata('__filterCatchExceptions__', DomainExceptionFilter),
    ).toHaveLength(1);
  });
});
