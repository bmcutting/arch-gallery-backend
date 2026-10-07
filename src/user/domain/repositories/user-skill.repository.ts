import { PaginationResult } from 'src/shared/domain/interfaces/pagination';
import { UserSkill } from '../entities/user-skill.entity';
import { UserSkillPaginationParams } from '../interfaces/user-skill-pagination';

export interface UserSkillRepository {
  saveMultiple(userSkills: UserSkill[]): Promise<void>;
  update(userSkill: UserSkill): Promise<void>;
  deleteByIds(ids: string[]): Promise<void>;
  deleteBySkillId(skillId: string): Promise<void>;
  findByUserId(userId: string): Promise<UserSkill[]>;
  find(props: UserSkillPaginationParams): Promise<PaginationResult<UserSkill>>;
}
