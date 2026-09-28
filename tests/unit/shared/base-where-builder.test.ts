import { describe, it, expect } from 'vitest';
import { UserWhereBuilder } from 'src/user/infrastructure/typeorm/utils/user-where-builder';
import { CategoryWhereBuilder } from 'src/category/infrastructure/typeorm/utils/category-where-builder';

describe('BaseWhereBuilder — filtro de borrado lógico', () => {
  it('devuelve solo activos cuando no se pide nada', () => {
    const where = CategoryWhereBuilder.build({});

    expect(where).toMatchObject({ isActive: true });
  });

  it('devuelve solo activos con isActive explícito', () => {
    expect(CategoryWhereBuilder.build({ isActive: true })).toMatchObject({
      isActive: true,
    });
  });

  it('devuelve solo eliminados con isActive false', () => {
    expect(CategoryWhereBuilder.build({ isActive: false })).toMatchObject({
      isActive: false,
    });
  });

  // El caso que se escapaba: con `search` el where pasa a ser un array de OR,
  // y el filtro tiene que estar en TODAS las ramas o se cuelan borrados.
  it('aplica el filtro en todas las ramas del OR de búsqueda', () => {
    const where = UserWhereBuilder.build({ search: 'ana' });

    expect(Array.isArray(where)).toBe(true);
    const branches = where as { isActive?: boolean }[];
    expect(branches.length).toBeGreaterThan(1);
    for (const branch of branches) {
      expect(branch.isActive).toBe(true);
    }
  });

  it('propaga isActive false a las ramas del OR', () => {
    const branches = UserWhereBuilder.build({
      search: 'ana',
      isActive: false,
    }) as { isActive?: boolean }[];

    for (const branch of branches) {
      expect(branch.isActive).toBe(false);
    }
  });
});
