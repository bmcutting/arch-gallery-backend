import { FindOptionsOrder } from 'typeorm';
import { SortOption } from '../domain/interfaces/sort-option';

export abstract class BaseOrderBuilder<TModel, TFields extends string> {
  protected order: FindOptionsOrder<TModel> = {};

  protected abstract buildOrder(sortOptions?: SortOption<TFields>[]): void;

  protected abstract getDefaultOrder(): FindOptionsOrder<TModel>;

  constructor(sortOptions?: SortOption<TFields>[]) {
    this.buildOrder(sortOptions);
  }

  getOrder(): FindOptionsOrder<TModel> {
    if (Object.keys(this.order).length === 0) {
      return this.getDefaultOrder();
    }
    return this.order;
  }
}
