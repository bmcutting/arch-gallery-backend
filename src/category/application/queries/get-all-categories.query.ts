import { Query } from 'src/shared/application/interfaces/queries.interface';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { PaginationResponseMapper } from 'src/shared/application/mappers/pagination-mapper';
import { CategoryPaginationRequest } from './requests/category-pagination.request';
import { CategoryResponse } from './responses/category.response';
import { CategoryRepository } from 'src/category/domain/repositories/category.repository';
import { CategoryResponseMapper } from '../mappers/category.mapper';

export class GetAllCategoriesQuery implements Query<
  CategoryPaginationRequest,
  PaginationResponse<CategoryResponse>
> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    request: CategoryPaginationRequest,
  ): Promise<PaginationResponse<CategoryResponse>> {
    const { items, totalItems, pagination } =
      await this.categoryRepository.findAll({
        page: request.page,
        limit: request.limit,
        search: request.search,
        createdAtMin: request.createdAtMin,
        createdAtMax: request.createdAtMax,
        name: request.name,
        deletedAtMax: request.deletedAtMax,
        deletedAtMin: request.deletedAtMin,
        isActive: request.isActive,
        sort: request.sort,
      });

    return PaginationResponseMapper.toResponse({
      items: CategoryResponseMapper.toResponseList(items),
      totalItems,
      ...pagination,
    });
  }
}
