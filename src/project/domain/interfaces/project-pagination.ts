import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { ProjectSortFields } from '../enums/project-sort-fields';

export interface ProjectPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  title?: string;
  createdAtMin?: Date;
  createdAtMax?: Date;
  isActive?: boolean;
  deletedAtMin?: Date;
  deletedAtMax?: Date;
  sort?: SortOption<ProjectSortFields>[];
}
