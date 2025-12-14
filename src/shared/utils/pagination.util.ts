export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface PaginationOptions {
  skip?: number;
  take?: number;
}

export function getPaginationInfo(
  totalItems: number,
  request: PaginationParams,
): PaginationInfo {
  if (!request.page || !request.pageSize) {
    return {
      page: 1,
      pageSize: totalItems,
      totalPages: 1,
      hasNextPage: false,
    };
  }

  const { page, pageSize } = request;
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = page < totalPages;

  return { page, pageSize, totalPages, hasNextPage };
}

export function getPaginationOptions(
  request: PaginationParams,
): PaginationOptions {
  if (!request.page || !request.pageSize) {
    return {};
  }

  const skip = (request.page - 1) * request.pageSize;
  const take = request.pageSize;

  return { skip, take };
}
