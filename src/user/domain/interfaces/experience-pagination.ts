import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { ExperienceType } from '../enums/experience';
import { ExperienceSortFields } from '../enums/experience-sort-fields';

export interface ExperiencePaginationParams {
  page?: number;
  limit?: number;
  type?: ExperienceType;
  // Lo exige BaseWhereBuilder. Inerte aqui: estas filas se borran en duro.
  isActive?: boolean;
  sort?: SortOption<ExperienceSortFields>[];
  userId: string;
}
