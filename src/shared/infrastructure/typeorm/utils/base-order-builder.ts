import { FindOptionsOrder } from 'typeorm';
import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { Model } from '../models/base.model';

export abstract class BaseOrderBuilder<
  TModel extends Model,
  TFields extends string,
> {
  protected order: FindOptionsOrder<TModel> = {};

  protected abstract buildOrder(sortOptions?: SortOption<TFields>[]): void;

  /**
   * Orden aplicado cuando la petición no trae ninguno. Cada builder puede
   * sobrescribirlo si su entidad necesita otro criterio.
   */
  protected getDefaultOrder(): FindOptionsOrder<TModel> {
    return { updatedAt: 'DESC' } as FindOptionsOrder<TModel>;
  }

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
