import { PaginationInfo } from 'src/shared/utils/pagination.util';

export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  pagination: PaginationInfo;
}
