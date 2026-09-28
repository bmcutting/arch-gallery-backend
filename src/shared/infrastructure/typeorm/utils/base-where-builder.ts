import { FindOptionsWhere } from 'typeorm';
import { Model } from '../models/base.model';

export interface SoftDeleteFilters {
  isActive?: boolean;
}

export abstract class BaseWhereBuilder<
  TModel extends Model,
  TFilters extends SoftDeleteFilters,
> {
  protected abstract buildWhereConditions(
    where: FindOptionsWhere<TModel>,
    filters: TFilters,
  ): FindOptionsWhere<TModel> | FindOptionsWhere<TModel>[] | void;

  protected getSoftDeleteFilter(filters: TFilters): boolean {
    return filters.isActive ?? true;
  }

  execute(
    filters: TFilters,
  ): FindOptionsWhere<TModel> | FindOptionsWhere<TModel>[] {
    const where = {
      isActive: this.getSoftDeleteFilter(filters),
    } as FindOptionsWhere<TModel>;

    const result = this.buildWhereConditions(where, filters);

    if (result !== undefined) {
      return result;
    }

    return where;
  }

  static build<TEntity extends Model, TFilters extends SoftDeleteFilters>(
    this: new () => BaseWhereBuilder<TEntity, TFilters>,
    filters: TFilters,
  ): FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[] {
    const builder = new this();
    return builder.execute(filters);
  }
}
