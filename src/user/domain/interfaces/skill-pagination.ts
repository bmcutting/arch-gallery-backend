import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { SkillSortFields } from '../enums/skill-sort-fields';

export interface SkillPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  createdAtMin?: Date;
  createdAtMax?: Date;
  isActive?: boolean;
  sort?: SortOption<SkillSortFields>[];
  viewerId: string;
}
