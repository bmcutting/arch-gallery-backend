import { Skill } from 'src/user/domain/entities/skill.entity';
import { SkillModel } from '../models/skill';

export class SkillTypeOrmMapper {
  static toDomain(model: SkillModel): Skill {
    return new Skill({
      id: model.id,
      name: model.name,
      level: model.level ?? undefined,
    });
  }

  static toModel(domain: Skill): SkillModel {
    const model = new SkillModel();
    model.id = domain.getId();
    model.name = domain.getName();
    model.level = domain.getLevel() ?? null;
    return model;
  }

  static toDomainList(models: SkillModel[]): Skill[] {
    return models.map((model) => this.toDomain(model));
  }

  static toModelList(domains: Skill[]): SkillModel[] {
    return domains.map((domain) => this.toModel(domain));
  }
}
