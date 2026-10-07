import { Skill } from '../../entities/skill.entity';
import { NotFoundSkillException } from '../../exceptions/skill';
import { SkillRepository } from '../../repositories/skill.repository';

interface Props {
  id: string;
  viewerId: string;
  onlyActive: boolean;
}

export class SkillFindById {
  constructor(private readonly repository: SkillRepository) {}

  async execute({ id, viewerId, onlyActive }: Props): Promise<Skill | null> {
    const skill = await this.repository.findById(id);

    if (!skill) return null;

    if (!this.isVisible(skill, viewerId)) return null;

    if (onlyActive && !skill.getIsActive()) return null;

    return skill;
  }

  async executeOrFail(props: Props): Promise<Skill> {
    const skill = await this.execute(props);

    // Lo que no se puede ver no existe: asi las ids no son sondeables.
    if (!skill) throw new NotFoundSkillException();

    return skill;
  }

  private isVisible(skill: Skill, viewerId: string): boolean {
    return skill.isGlobal() || skill.getCreatedById() === viewerId;
  }
}
