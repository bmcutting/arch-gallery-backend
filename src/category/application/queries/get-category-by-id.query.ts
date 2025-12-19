import { Query } from 'src/shared/interfaces/queries.interface';
import { CategoryResponseMapper } from '../mappers/category.mapper';
import { CategoryRepository } from 'src/category/domain/repositories/category.repository';
import { NotFoundCategoryException } from 'src/category/domain/exceptions/category';
import { CategoryResponse } from './responses/category.response';
import { GetCategoryByIdRequest } from './requests/category-get-by-id.request';

export class GetCategoryByIdQuery implements Query<
  GetCategoryByIdRequest,
  Promise<CategoryResponse>
> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute({ id }: GetCategoryByIdRequest): Promise<CategoryResponse> {
    const found = await this.categoryRepository.findById(id);

    if (found && !found.deletedAt) {
      return CategoryResponseMapper.toReponse(found);
    }

    throw new NotFoundCategoryException();
  }
}
