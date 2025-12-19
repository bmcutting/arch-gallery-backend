import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { CategorySortFields } from '../enums/category-sort-fields';

export interface CategoryPaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  name?: string;
  createdAtMin?: Date;
  createdAtMax?: Date;
  includeDeleted?: boolean;
  onlyDeleted?: boolean;
  deletedAtMin?: Date;
  deletedAtMax?: Date;
  sort?: SortOption<CategorySortFields>[];
}
