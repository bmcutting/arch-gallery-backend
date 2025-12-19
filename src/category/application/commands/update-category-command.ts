import { Command } from 'src/shared/interfaces/command.interface';
import { UpdateCategoryRequest } from './requests/update-category.request';
import { UpdateCategory } from 'src/category/domain/services/category-update';
import { UpdateCategoryResponse } from './responses/update-category.response';
import { NotFoundCategoryException } from 'src/category/domain/exceptions/category';
import { CategoryRepository } from 'src/category/domain/repositories/category.repository';

interface UpdateCategoryProps {
  request: UpdateCategoryRequest;
}

export class UpdateCategoryCommand implements Command<
  UpdateCategoryProps,
  UpdateCategoryResponse
> {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly updateCategoryService: UpdateCategory,
  ) {}

  async execute(props: UpdateCategoryProps): Promise<UpdateCategoryResponse> {
    const category = await this.categoryRepository.findById(
      props.request.categoryId,
    );
    if (!category) {
      throw new NotFoundCategoryException();
    }

    await this.updateCategoryService.execute(category, {
      name: props.request.name,
    });

    return { success: true };
  }
}
