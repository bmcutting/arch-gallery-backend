import { Category } from 'src/category/domain/entities/category';
import { CategoryModel } from '../models/category';

export class CategoryTypeOrmMapper {
  constructor() {}

  static execute(c: CategoryModel): Category {
    return new Category({
      id: c.id,
      name: c.name,
      isActive: true,
    });
  }
}
