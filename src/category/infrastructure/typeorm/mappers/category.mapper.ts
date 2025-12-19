import { Category } from 'src/category/domain/entities/category';
import { CategoryModel } from '../models/category';

export class CategoryTypeOrmMapper {
  constructor() {}

  static toDomain(c: CategoryModel): Category {
    return new Category({
      id: c.id,
      name: c.name,
      createdAt: c.createdAt,
      isActive: c.isActive,
      deletedAt: c.deletedAt,
    });
  }
  static toDomainList(cList: CategoryModel[]): Category[] {
    return cList.map((c) => this.toDomain(c));
  }
}
