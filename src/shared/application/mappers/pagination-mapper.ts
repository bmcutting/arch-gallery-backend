import { PaginationResponse } from '../responses/pagination.response';

export class PaginationResponseMapper {
  static toResponse<T>(params: {
    items: T[];
    totalItems: number;
    totalPages: number;
    limit: number;
    hasNextPage: boolean;
  }): PaginationResponse<T> {
    const { items, totalItems, totalPages, limit, hasNextPage } = params;

    return {
      items,
      totalItems,
      totalPages,
      limit,
      hasNextPage,
    };
  }
}
