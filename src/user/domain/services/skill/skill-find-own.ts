import { Skill } from '../../entities/skill.entity';
import { NotFoundSkillException } from '../../exceptions/skill';
import { SkillRepository } from '../../repositories/skill.repository';

interface Props {
  id: string;
  ownerId: string;
  onlyActive: boolean;
}

export class SkillFindOwn {
  constructor(private readonly repository: SkillRepository) {}

  async execute({ id, ownerId, onlyActive }: Props): Promise<Skill | null> {
    const skill = await this.repository.findById(id);

    if (!skill) return null;

    // Una global no es de nadie, ni de quien la acuño: promocionar es publicar.
    if (skill.isGlobal() || skill.getCreatedById() !== ownerId) return null;

    if (onlyActive && !skill.getIsActive()) return null;

    return skill;
  }

  async executeOrFail(props: Props): Promise<Skill> {
    const skill = await this.execute(props);

    if (!skill) throw new NotFoundSkillException();

    return skill;
  }
}
