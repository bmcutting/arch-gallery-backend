import { BaseWhereBuilder } from 'src/shared/infrastructure/typeorm/utils/base-where-builder';
import { FindOptionsWhere } from 'typeorm';
import { WhereUtils } from 'src/shared/infrastructure/typeorm/utils/where-utils';
import { SkillModel } from '../models/skill.model';
import { SkillPaginationParams } from 'src/user/domain/interfaces/skill-pagination';
import { SkillScope } from 'src/user/domain/enums/skill-scope';

export class SkillWhereBuilder extends BaseWhereBuilder<
  SkillModel,
  SkillPaginationParams
> {
  protected buildWhereConditions(
    where: FindOptionsWhere<SkillModel>,
    filters: SkillPaginationParams,
  ): FindOptionsWhere<SkillModel>[] {
    this.applyStandardFilters(where, filters);

    const branches = filters.search
      ? this.searchBranches(filters.search, where)
      : [where];

    return this.scopeToViewer(branches, filters.viewerId);
  }

  private applyStandardFilters(
    where: FindOptionsWhere<SkillModel>,
    filters: SkillPaginationParams,
  ): void {
    where.normalizedName = WhereUtils.ilikeUnaccent(filters.name);
    where.createdAt = WhereUtils.dateRange(
      filters.createdAtMin,
      filters.createdAtMax,
    );
    return;
  }

  private searchBranches(
    search: string,
    baseWhere: FindOptionsWhere<SkillModel>,
  ): FindOptionsWhere<SkillModel>[] {
    return [{ ...baseWhere, normalizedName: WhereUtils.ilikeUnaccent(search) }];
  }

  /**
   * Visibilidad del catalogo: global, o mia.
   *
   * Se aplica a TODAS las ramas, y es el ultimo paso de `buildWhereConditions` a proposito: las
   * ramas de `search` son un OR, y un predicado puesto solo en el objeto base no llega a ellas.
   * El spread lo pone al final, asi que pisa cualquier filtro que intentara ampliar lo que se ve.
   */
  private scopeToViewer(
    branches: FindOptionsWhere<SkillModel>[],
    viewerId: string,
  ): FindOptionsWhere<SkillModel>[] {
    return branches.flatMap((branch) => [
      { ...branch, scope: SkillScope.GLOBAL },
      { ...branch, created_by_id: viewerId },
    ]);
  }
}
