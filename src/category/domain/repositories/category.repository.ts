import { PaginationResult } from 'src/shared/domain/interfaces/pagination-result';
import { Category } from '../entities/category';
import { CategoryPaginationParams } from '../interfaces/category-pagination';

export interface CategoryRepository {
  create(props: CreateCategoryProps): Promise<string>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category[] | null>;
  findAll(props: CategoryPaginationParams): Promise<PaginationResult<Category>>;
  update(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
  addCategory(projectId: string, categoryId: string): Promise<void>;
  removeCategory(projectId: string, categoryId: string): Promise<void>;
}

export interface CreateCategoryProps {
  name: string;
  projectId: string;
}
