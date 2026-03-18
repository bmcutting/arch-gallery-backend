import { Query } from 'src/shared/interfaces/queries.interface';
import { CategoryResponse } from './responses/category.response';
import { CategoryRepository } from 'src/category/domain/repositories/category.repository';
import { SearchCategoriesRequest } from './requests/search-categories.request';
import { CategoryResponseMapper } from '../mappers/category.mapper';

export class SearchCategoriesQuery implements Query<
  SearchCategoriesRequest,
  Promise<CategoryResponse[] | null>
> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute({
    name,
  }: SearchCategoriesRequest): Promise<CategoryResponse[] | null> {
    const found = await this.categoryRepository.findByName(name);

    if (found) {
      return CategoryResponseMapper.toResponseList(found);
    }

    return null;
  }
}
