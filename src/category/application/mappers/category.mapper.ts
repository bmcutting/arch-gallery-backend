import { Category } from 'src/category/domain/entities/category';
import { CategoryResponse } from '../queries/responses/category.response';

export class CategoryResponseMapper {
  static toReponse(category: Category): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
      isActive: category.isActive,
      createdAt: category.getCreatedAt(),
      deletedAt: category.getDeletedAt(),
    };
  }

  static toResponseList(categorys: Category[]): CategoryResponse[] {
    return categorys.map((category) => this.toReponse(category));
  }
}
