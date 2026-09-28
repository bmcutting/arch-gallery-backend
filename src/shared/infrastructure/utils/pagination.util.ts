import {
  PaginationInfo,
  PaginationParams,
} from 'src/shared/domain/interfaces/pagination';

export interface PaginationOptions {
  skip?: number;
  take?: number;
}

export function getPaginationInfo(
  totalItems: number,
  request: PaginationParams,
): PaginationInfo {
  if (!request.page || !request.limit) {
    return {
      page: 1,
      limit: totalItems,
      totalPages: 1,
      hasNextPage: false,
    };
  }

  const { page, limit } = request;
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;

  return { page, limit, totalPages, hasNextPage };
}

export function getPaginationOptions(
  request: PaginationParams,
): PaginationOptions {
  if (!request.page || !request.limit) {
    return {};
  }

  const skip = (request.page - 1) * request.limit;
  const take = request.limit;

  return { skip, take };
}
