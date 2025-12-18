import { BaseWhereBuilder } from 'src/shared/utils/base-where-builder';
import { ProjectModel } from '../models/project';
import { ProjectPaginationParams } from 'src/project/domain/interfaces/project-pagination';
import { FindOptionsWhere } from 'typeorm';
import { WhereUtils } from 'src/shared/utils/create-where';

export class ProjectWhereBuilder extends BaseWhereBuilder<
  ProjectModel,
  ProjectPaginationParams
> {
  protected buildWhereConditions(
    where: FindOptionsWhere<ProjectModel>,
    filters: ProjectPaginationParams,
  ): FindOptionsWhere<ProjectModel> | FindOptionsWhere<ProjectModel>[] {
    where.isActive = this.getSoftDeleteFilter(filters);

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

  private getSoftDeleteFilter(
    filters: ProjectPaginationParams,
  ): boolean | undefined {
    if (filters.onlyDeleted) return false;
    if (filters.includeDeleted) return undefined;
    return true;
  }
}
