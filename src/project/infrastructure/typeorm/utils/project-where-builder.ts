import { BaseWhereBuilder } from 'src/shared/infrastructure/typeorm/utils/base-where-builder';
import { ProjectModel } from '../models/project';
import { ProjectPaginationParams } from 'src/project/domain/interfaces/project-pagination';
import { FindOptionsWhere } from 'typeorm';
import { WhereUtils } from 'src/shared/infrastructure/typeorm/utils/where-utils';

export class ProjectWhereBuilder extends BaseWhereBuilder<
  ProjectModel,
  ProjectPaginationParams
> {
  protected buildWhereConditions(
    where: FindOptionsWhere<ProjectModel>,
    filters: ProjectPaginationParams,
  ): FindOptionsWhere<ProjectModel> | FindOptionsWhere<ProjectModel>[] {
    this.applyStandardFilters(where, filters);

    if (filters.search) {
      return this.createSearchConditions(filters.search, where);
    }
    return where;
  }

  private applyStandardFilters(
    where: FindOptionsWhere<ProjectModel>,
    filters: ProjectPaginationParams,
  ): void {
    where.title = WhereUtils.ilikeUnaccent(filters.title);
    where.createdAt = WhereUtils.dateRange(
      filters.createdAtMin,
      filters.createdAtMax,
    );
    return;
  }

  private createSearchConditions(
    search: string,
    baseWhere: FindOptionsWhere<ProjectModel>,
  ): FindOptionsWhere<ProjectModel>[] {
    const searchConditions: FindOptionsWhere<ProjectModel>[] = [];

    searchConditions.push({
      ...baseWhere,
      title: WhereUtils.ilikeUnaccent(search),
    });

    return searchConditions;
  }
}
