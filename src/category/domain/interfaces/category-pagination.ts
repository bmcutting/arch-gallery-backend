import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { CategorySortFields } from '../enums/category-sort-fields';

export interface CategoryPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  createdAtMin?: Date;
  createdAtMax?: Date;
  isActive?: boolean;
  deletedAtMin?: Date;
  deletedAtMax?: Date;
  sort?: SortOption<CategorySortFields>[];
}
