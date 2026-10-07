import type IdGenerator from 'src/shared/domain/interfaces/id.generator';
import type TextNormalizer from 'src/shared/domain/interfaces/text.normalizer';
import { Skill } from '../../entities/skill.entity';
import { SkillScope } from '../../enums/skill-scope';
import { InvalidSkillNameException } from '../../exceptions/skill';
import { SkillRepository } from '../../repositories/skill.repository';
import { SkillFindById } from './skill-find-by-id';

export interface SkillRef {
  id?: string;
  name?: string;
}

interface Props {
  ref: SkillRef;
  ownerId: string;
}

export class SkillResolve {
  constructor(
    private readonly repository: SkillRepository,
    private readonly skillFindById: SkillFindById,
    private readonly normalizer: TextNormalizer,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute({ ref, ownerId }: Props): Promise<Skill> {
    if (ref.id) {
      return await this.skillFindById.executeOrFail({
        id: ref.id,
        viewerId: ownerId,
        onlyActive: true,
      });
    }

    if (!ref.name) throw new InvalidSkillNameException();

    return await this.byName(ref.name, ownerId);
  }

  private async byName(name: string, ownerId: string): Promise<Skill> {
    const normalizedName = this.normalizer.normalize(name);

    if (!normalizedName) throw new InvalidSkillNameException();

    const global = await this.repository.findByNormalizedName(
      normalizedName,
      SkillScope.GLOBAL,
    );

    // Una global retirada no se resucita escribiendola: se cae a la rama privada.
    if (global?.getIsActive()) return global;

    const own = await this.repository.findByNormalizedName(
      normalizedName,
      SkillScope.PRIVATE,
      ownerId,
    );

    if (own) return await this.reuse(own, name);

    return await this.create(name, normalizedName, ownerId);
  }

  private async reuse(own: Skill, displayName: string): Promise<Skill> {
    if (own.getIsActive()) return own;

    own.reactivate();
    own.rename({ displayName, normalizedName: own.getNormalizedName() });
    await this.repository.update(own);
    return own;
  }

  // Un usuario nunca crea filas GLOBAL: esas salen de la semilla.
  private async create(
    displayName: string,
    normalizedName: string,
    ownerId: string,
  ): Promise<Skill> {
    const skill = new Skill({
      id: this.idGenerator.create(),
      scope: SkillScope.PRIVATE,
      displayName,
      normalizedName,
      createdById: ownerId,
    });

    await this.repository.save(skill);
    return skill;
  }
}
