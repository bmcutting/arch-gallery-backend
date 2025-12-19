import { Category } from '../entities/category';
import { CategoryRepository } from '../repositories/category.repository';

export interface UpdateCategoryProps {
  name?: string;
}

export class UpdateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    category: Category,
    props: UpdateCategoryProps,
  ): Promise<Category> {
    let hasChanges = false;

    if (props.name !== undefined && props.name !== category.getName()) {
      category.setName(props.name);
      hasChanges = true;
    }

    if (hasChanges) {
      await this.categoryRepository.update(category);
    }

    return category;
  }
}
