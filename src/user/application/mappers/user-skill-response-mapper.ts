import { UserSkill } from 'src/user/domain/entities/user-skill.entity';
import { UserSkillResponse } from '../queries/skill/responses/user-skill.response';

export class UserSkillResponseMapper {
  static toResponse(userSkill: UserSkill): UserSkillResponse {
    return {
      id: userSkill.getId(),
      skillId: userSkill.getSkillId(),
      name: userSkill.skill.getDisplayName(),
      scope: userSkill.skill.getScope(),
      level: userSkill.getLevel(),
    };
  }

  static toResponseList(userSkills: UserSkill[]): UserSkillResponse[] {
    return userSkills.map((userSkill) => this.toResponse(userSkill));
  }
}
