import { SortOption, SortDirection } from '../domain/interfaces/sort-option';

export class OrderUtils {
  static execute<TFields extends string>(
    sortOptions?: SortOption<TFields>[],
  ): Partial<Record<TFields, SortDirection>> {
    if (!sortOptions || sortOptions.length === 0) return {};
    return sortOptions.reduce(
      (acc, sort) => {
        if (
          sort.field &&
          (sort.direction === 'ASC' || sort.direction === 'DESC')
        ) {
          acc[sort.field] = sort.direction;
        }
        return acc;
      },
      {} as Partial<Record<TFields, SortDirection>>,
    );
  }
}
