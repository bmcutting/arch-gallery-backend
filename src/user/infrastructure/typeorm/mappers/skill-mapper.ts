import { Skill } from 'src/user/domain/entities/skill.entity';
import { SkillModel } from '../models/skill.model';

export class SkillTypeOrmMapper {
  static toDomain(model: SkillModel): Skill {
    return new Skill({
      id: model.id,
      scope: model.scope,
      displayName: model.displayName,
      normalizedName: model.normalizedName,
      createdById: model.created_by_id,
      createdAt: model.createdAt,
      isActive: model.isActive,
      deletedAt: model.deletedAt,
    });
  }

  static toModel(domain: Skill): SkillModel {
    const model = new SkillModel();
    model.id = domain.getId();
    model.scope = domain.getScope();
    model.displayName = domain.getDisplayName();
    model.normalizedName = domain.getNormalizedName();
    model.created_by_id = domain.getCreatedById();
    model.isActive = domain.getIsActive();
    model.deletedAt = domain.getDeletedAt();
    return model;
  }

  static toDomainList(models: SkillModel[]): Skill[] {
    return models.map((model) => this.toDomain(model));
  }

  static toModelList(domains: Skill[]): SkillModel[] {
    return domains.map((domain) => this.toModel(domain));
  }
}
