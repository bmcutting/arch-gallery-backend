import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

/**
 * Booleano opcional desde query string.
 *
 * Existe porque `@Type(() => Boolean)` no sirve aquí: `Boolean('false')` es `true`,
 * así que un `?isActive=false` acababa valiendo `true`. Este transform distingue
 * la cadena `'false'` y descarta cualquier otro valor como `undefined`.
 */
export function IsBooleanOptional() {
  return applyDecorators(
    Transform(({ value }) => {
      if (value === undefined) return undefined;
      if (value === 'true' || value === true) return true;
      if (value === 'false' || value === false) return false;
      return undefined;
    }),
    IsOptional(),
    IsBoolean(),
  );
}
