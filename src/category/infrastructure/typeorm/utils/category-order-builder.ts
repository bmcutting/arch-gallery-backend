import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { FindOptionsOrder } from 'typeorm';
import { BaseOrderBuilder } from 'src/shared/infrastructure/typeorm/utils/base-order-builder';
import { CategoryModel } from '../models/category.model';
import { CategorySortFields } from 'src/category/domain/enums/category-sort-fields';

export class CategoryOrderBuilder extends BaseOrderBuilder<
  CategoryModel,
  CategorySortFields
> {
  protected buildOrder(sortOptions?: SortOption<CategorySortFields>[]): void {
    if (!sortOptions || sortOptions.length === 0) return;

    sortOptions.forEach((sortOption) => {
      if (!sortOption?.field || !sortOption?.direction) return;

      switch (sortOption.field) {
        case CategorySortFields.NAME:
          this.order.name = sortOption.direction;
          break;
      }
    });
  }

  static build(
    sortOptions?: SortOption<CategorySortFields>[],
  ): FindOptionsOrder<CategoryModel> {
    const builder = new CategoryOrderBuilder(sortOptions);
    return builder.getOrder();
  }
}
