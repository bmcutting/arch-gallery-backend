import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { UserSkillSortFields } from '../enums/user-skill-sort-fields';
import { Level } from '../enums/level';
import { SkillScope } from '../enums/skill-scope';

export interface UserSkillPaginationParams {
  page?: number;
  limit?: number;
  name?: string;
  level?: Level;
  // Lo exige BaseWhereBuilder. Inerte aqui: estas filas se borran en duro.
  isActive?: boolean;
  scope?: SkillScope;
  sort?: SortOption<UserSkillSortFields>[];
  userId: string;
}
