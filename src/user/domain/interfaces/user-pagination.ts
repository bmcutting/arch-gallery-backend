import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { UserSortFields } from '../enums/user-sort-fields';

export interface UserPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  createdAtMin?: Date;
  createdAtMax?: Date;
  isActive?: boolean;
  deletedAtMin?: Date;
  deletedAtMax?: Date;
  sort?: SortOption<UserSortFields>[];
}
