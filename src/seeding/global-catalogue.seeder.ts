import { DataSource } from 'typeorm';
import { ulid } from 'ulid';
import { SimpleTextNormalizer } from 'src/shared/domain/services/simple-text.normalizer';
import { SkillModel } from 'src/user/infrastructure/typeorm/models/skill.model';
import { SkillScope } from 'src/user/domain/enums/skill-scope';
import { GLOBAL_SKILLS } from './data/global-skills';

/**
 * Idempotente por `normalizedName`: sin `unique` en la base no hay nada que impida dos
 * "AutoCAD" globales, y un catálogo duplicado rompe justo el filtro que existe para servir.
 */
export async function seedGlobalSkills(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(SkillModel);
  const normalizer = new SimpleTextNormalizer();

  for (const displayName of GLOBAL_SKILLS) {
    const normalizedName = normalizer.normalize(displayName);

    // Sin filtro de isActive: una global retirada sigue ocupando su nombre.
    const existing = await repository.findOne({
      where: { normalizedName, scope: SkillScope.GLOBAL },
    });

    if (existing) continue;

    const skill = new SkillModel();
    skill.id = ulid();
    skill.scope = SkillScope.GLOBAL;
    skill.displayName = displayName;
    skill.normalizedName = normalizedName;
    skill.created_by_id = null;

    await repository.save(skill);
  }
}
