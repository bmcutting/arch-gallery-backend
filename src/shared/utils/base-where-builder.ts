import { FindOptionsWhere } from 'typeorm';

export abstract class BaseWhereBuilder<TModel, TFilters> {
  protected abstract buildWhereConditions(
    where: FindOptionsWhere<TModel>,
    filters: TFilters,
  ): FindOptionsWhere<TModel> | FindOptionsWhere<TModel>[] | void;

  execute(
    filters: TFilters,
  ): FindOptionsWhere<TModel> | FindOptionsWhere<TModel>[] {
    const where: FindOptionsWhere<TModel> = {};
    const result = this.buildWhereConditions(where, filters);

    if (result !== undefined) {
      return result;
    }

    return where;
  }

  static build<TEntity, TFilters>(
    this: new () => BaseWhereBuilder<TEntity, TFilters>,
    filters: TFilters,
  ): FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[] {
    const builder = new this();
    return builder.execute(filters);
  }
}
