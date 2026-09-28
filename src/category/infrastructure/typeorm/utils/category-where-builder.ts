import { BaseWhereBuilder } from 'src/shared/infrastructure/typeorm/utils/base-where-builder';
import { FindOptionsWhere } from 'typeorm';
import { WhereUtils } from 'src/shared/infrastructure/typeorm/utils/where-utils';
import { CategoryModel } from '../models/category';
import { CategoryPaginationParams } from 'src/category/domain/interfaces/category-pagination';

export class CategoryWhereBuilder extends BaseWhereBuilder<
  CategoryModel,
  CategoryPaginationParams
> {
  protected buildWhereConditions(
    where: FindOptionsWhere<CategoryModel>,
    filters: CategoryPaginationParams,
  ): FindOptionsWhere<CategoryModel> | FindOptionsWhere<CategoryModel>[] {
    this.applyStandardFilters(where, filters);

    if (filters.search) {
      return this.createSearchConditions(filters.search, where);
    }
    return where;
  }

  private applyStandardFilters(
    where: FindOptionsWhere<CategoryModel>,
    filters: CategoryPaginationParams,
  ): void {
    where.name = WhereUtils.ilikeUnaccent(filters.name);
    where.createdAt = WhereUtils.dateRange(
      filters.createdAtMin,
      filters.createdAtMax,
    );
    return;
  }

  private createSearchConditions(
    search: string,
    baseWhere: FindOptionsWhere<CategoryModel>,
  ): FindOptionsWhere<CategoryModel>[] {
    const searchConditions: FindOptionsWhere<CategoryModel>[] = [];

    searchConditions.push({
      ...baseWhere,
      name: WhereUtils.ilikeUnaccent(search),
    });

    return searchConditions;
  }
}
