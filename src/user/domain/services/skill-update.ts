import { Skill } from '../entities/skill.entity';
import { Level } from '../enums/level';
import { SkillRepository } from '../repositories/skill.repository';

export interface UpdateSkillProps {
  name?: string;
  level?: Level;
}

export class UpdateSkill {
  constructor(private readonly skillRepository: SkillRepository) {}

  async execute(skill: Skill, props: UpdateSkillProps): Promise<Skill> {
    let hasChanges = false;

    if (props.name !== undefined && props.name !== skill.getName()) {
      skill.setName(props.name);
      hasChanges = true;
    }

    if (props.level !== undefined && props.level !== skill.getLevel()) {
      skill.setLevel(props.level);
      hasChanges = true;
    }

    if (hasChanges) {
      await this.skillRepository.update(skill);
    }

    return skill;
  }
}
