import { Skill } from 'src/user/domain/entities/skill.entity';
import { SkillResponse } from '../queries/skill/responses/skill.response';

export class SkillResponseMapper {
  static toResponse(skill: Skill): SkillResponse {
    return {
      id: skill.getId(),
      name: skill.getDisplayName(),
      scope: skill.getScope(),
    };
  }

  static toResponseList(skills: Skill[]): SkillResponse[] {
    return skills.map((skill) => this.toResponse(skill));
  }
}
