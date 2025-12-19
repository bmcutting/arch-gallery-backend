import { Command } from 'src/shared/interfaces/command.interface';
import { CreateCategoryRequest } from './requests/create-category.request';
import { CreateCategoryResponse } from './responses/create-category.response';
import { CategoryCreator } from 'src/category/domain/services/category-create';

export class CreateCategoryCommand implements Command<
  CreateCategoryRequest,
  CreateCategoryResponse
> {
  constructor(private readonly createCategoryService: CategoryCreator) {}

  async execute(props: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    const categoryId = await this.createCategoryService.execute({
      name: props.name,
      projectId: props.projectId,
    });

    return { id: categoryId };
  }
}
