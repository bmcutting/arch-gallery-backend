import { Skill } from 'src/user/domain/entities/skill.entity';
import { SkillResponse } from '../queries/responses/skill.reponse';

export class SkillResponseMapper {
  static toResponse(skill: Skill): SkillResponse {
    return {
      id: skill.getId(),
      name: skill.getName(),
      level: skill.getLevel() ?? undefined,
    };
  }

  static toResponseList(skills: Skill[]): SkillResponse[] {
    return skills.map((skill) => this.toResponse(skill));
  }
}
