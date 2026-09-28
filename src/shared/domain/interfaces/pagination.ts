export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  pagination: PaginationInfo;
}
