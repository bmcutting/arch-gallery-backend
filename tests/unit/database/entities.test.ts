import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ENTITIES } from 'src/database/typeorm.config';

const SRC = join(process.cwd(), 'src');

// Si un modelo no está registrado, TypeORM no conoce su tabla y el fallo sale
// en la primera consulta, no al arrancar.
describe('entidades registradas en el DataSource', () => {
  const modelFiles = readdirSync(SRC, { recursive: true })
    .map(String)
    .map((file) => file.replaceAll('\\', '/'))
    .filter((file) => file.endsWith('.model.ts'))
    // `base.model.ts` es la clase abstracta, no una entidad.
    .filter((file) => !file.endsWith('/base.model.ts'));

  it('encuentra modelos que inspeccionar', () => {
    expect(modelFiles.length).toBeGreaterThan(0);
  });

  it('registra todos los modelos, y ninguno de más', () => {
    const expected = modelFiles
      .map((file) => file.split('/').pop()!.replace('.model.ts', ''))
      .map((name) =>
        name
          .split('-')
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(''),
      )
      .map((name) => `${name}Model`)
      .sort();

    const registered = ENTITIES.map((entity) => entity.name).sort();

    expect(registered).toEqual(expected);
  });
});
