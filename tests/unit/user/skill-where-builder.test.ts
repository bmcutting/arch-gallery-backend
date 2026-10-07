import { describe, expect, it } from 'vitest';
import { FindOptionsWhere } from 'typeorm';
import { SkillWhereBuilder } from 'src/user/infrastructure/typeorm/utils/skill-where-builder';
import { SkillModel } from 'src/user/infrastructure/typeorm/models/skill.model';
import { SkillScope } from 'src/user/domain/enums/skill-scope';
import { SkillPaginationParams } from 'src/user/domain/interfaces/skill-pagination';

const VIEWER = '01JA0000000000000000000001';

function build(
  filters: Partial<SkillPaginationParams> = {},
): FindOptionsWhere<SkillModel>[] {
  const where = SkillWhereBuilder.build({ viewerId: VIEWER, ...filters });
  return Array.isArray(where) ? where : [where];
}

function isVisibilityScoped(branch: FindOptionsWhere<SkillModel>): boolean {
  return branch.scope === SkillScope.GLOBAL || branch.created_by_id === VIEWER;
}

describe('SkillWhereBuilder', () => {
  it('abre una rama global y otra propia', () => {
    const branches = build();

    expect(branches).toHaveLength(2);
    expect(branches[0].scope).toBe(SkillScope.GLOBAL);
    expect(branches[1].created_by_id).toBe(VIEWER);
  });

  // La garantia que importa: si una rama se escapa, el buscador devuelve las filas
  // privadas de otros usuarios.
  it('ninguna rama sale sin predicado de visibilidad', () => {
    for (const filters of [
      {},
      { search: 'minimal' },
      { name: 'revit' },
      { search: 'minimal', name: 'revit' },
    ]) {
      const branches = build(filters);

      expect(branches.length).toBeGreaterThan(0);
      expect(branches.every(isVisibilityScoped)).toBe(true);
    }
  });

  it('el scope se aplica tambien a las ramas de busqueda', () => {
    const branches = build({ search: 'minimal' });

    expect(branches).toHaveLength(2);
    for (const branch of branches) {
      expect(branch.normalizedName).toBeDefined();
      expect(isVisibilityScoped(branch)).toBe(true);
    }
  });

  it('conserva el isActive que siembra la clase base', () => {
    for (const branch of build({ search: 'minimal' })) {
      expect(branch.isActive).toBe(true);
    }
  });

  it('un scope que llegue en los filtros no amplia lo que se ve', () => {
    const branches = build({
      ...({ scope: SkillScope.PRIVATE } as Partial<SkillPaginationParams>),
    });

    expect(branches.every(isVisibilityScoped)).toBe(true);
  });
});
