import type IdGenerator from 'src/shared/domain/interfaces/id.generator';
import { Level } from '../../enums/level';
import { Skill } from '../../entities/skill.entity';
import { UserSkill } from '../../entities/user-skill.entity';
import { DuplicateUserSkillException } from '../../exceptions/skill';
import { UserSkillRepository } from '../../repositories/user-skill.repository';
import { SkillResolve, SkillRef } from '../skill/skill-resolve';

export interface UserSkillInput extends SkillRef {
  level?: Level | null;
}

interface Props {
  userId: string;
  skills: UserSkillInput[];
}

interface Wanted {
  skill: Skill;
  level: Level | null;
}

export class UserSkillSync {
  constructor(
    private readonly repository: UserSkillRepository,
    private readonly skillResolve: SkillResolve,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute({ userId, skills }: Props): Promise<UserSkill[]> {
    const wanted = await this.resolve({ userId, skills });

    // El diff va contra las filas crudas, no contra una coleccion deduplicada.
    const existing = await this.repository.findByUserId(userId);
    const { survivors, toDelete } = await this.reconcile(existing, wanted);
    const created = this.build(userId, wanted, existing);

    if (created.length > 0) await this.repository.saveMultiple(created);
    if (toDelete.length > 0) await this.repository.deleteByIds(toDelete);

    return [...survivors, ...created];
  }

  private async resolve({
    userId,
    skills,
  }: Props): Promise<Map<string, Wanted>> {
    const wanted = new Map<string, Wanted>();

    for (const input of skills) {
      const skill = await this.skillResolve.execute({
        ref: input,
        ownerId: userId,
      });

      if (wanted.has(skill.getId())) throw new DuplicateUserSkillException();

      wanted.set(skill.getId(), { skill, level: input.level ?? null });
    }

    return wanted;
  }

  private async reconcile(
    existing: UserSkill[],
    wanted: Map<string, Wanted>,
  ): Promise<{ survivors: UserSkill[]; toDelete: string[] }> {
    const survivors: UserSkill[] = [];
    const toDelete: string[] = [];
    const seen = new Set<string>();

    for (const row of existing) {
      const skillId = row.getSkillId();
      const match = wanted.get(skillId);

      // Se borra lo que ya no se quiere y las filas repetidas de un par que si:
      // de un duplicado sobrevive la primera y mueren las demas.
      if (!match || seen.has(skillId)) {
        toDelete.push(row.getId());
        continue;
      }

      seen.add(skillId);

      if (row.getLevel() !== match.level) {
        row.setLevel(match.level);
        await this.repository.update(row);
      }

      survivors.push(row);
    }

    return { survivors, toDelete };
  }

  private build(
    userId: string,
    wanted: Map<string, Wanted>,
    existing: UserSkill[],
  ): UserSkill[] {
    const linked = new Set(existing.map((row) => row.getSkillId()));

    return [...wanted.values()]
      .filter((item) => !linked.has(item.skill.getId()))
      .map(
        (item) =>
          new UserSkill({
            id: this.idGenerator.create(),
            userId,
            skill: item.skill,
            level: item.level,
          }),
      );
  }
}
