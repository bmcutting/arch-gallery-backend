import { Skill } from '../../entities/skill.entity';
import { SkillRepository } from '../../repositories/skill.repository';
import { UserSkillRepository } from '../../repositories/user-skill.repository';
import { SkillFindOwn } from './skill-find-own';

interface Props {
  id: string;
  ownerId: string;
}

export class SkillDelete {
  constructor(
    private readonly repository: SkillRepository,
    private readonly userSkillRepository: UserSkillRepository,
    private readonly skillFindOwn: SkillFindOwn,
  ) {}

  async execute({ id, ownerId }: Props): Promise<Skill> {
    const skill = await this.skillFindOwn.executeOrFail({
      id,
      ownerId,
      onlyActive: true,
    });

    // Primero las filas de join: una skill borrada no puede dejar perfiles apuntandola.
    await this.userSkillRepository.deleteBySkillId(skill.getId());

    skill.delete();
    await this.repository.update(skill);

    return skill;
  }
}
