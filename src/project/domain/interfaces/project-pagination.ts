import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { ProjectSortFields } from '../enums/project-sort-fields';

export interface ProjectPaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  title?: string;
  createdAtMin?: Date;
  createdAtMax?: Date;
  includeDeleted?: boolean;
  onlyDeleted?: boolean;
  deletedAtMin?: Date;
  deletedAtMax?: Date;
  sort?: SortOption<ProjectSortFields>[];
}
