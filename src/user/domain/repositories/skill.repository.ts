import { PaginationResult } from 'src/shared/domain/interfaces/pagination';
import { Skill } from '../entities/skill.entity';
import { SkillScope } from '../enums/skill-scope';
import { SkillPaginationParams } from '../interfaces/skill-pagination';

export interface SkillRepository {
  save(skill: Skill): Promise<void>;
  update(skill: Skill): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Skill | null>;
  findByNormalizedName(
    normalizedName: string,
    scope: SkillScope,
    createdById?: string,
  ): Promise<Skill | null>;
  find(props: SkillPaginationParams): Promise<PaginationResult<Skill>>;
}
