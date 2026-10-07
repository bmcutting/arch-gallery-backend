import { UserSkill } from 'src/user/domain/entities/user-skill.entity';
import { UserSkillModel } from '../models/user-skill.model';
import { SkillTypeOrmMapper } from './skill-mapper';

export class UserSkillTypeOrmMapper {
  static toDomain(model: UserSkillModel): UserSkill {
    return new UserSkill({
      id: model.id,
      userId: model.user_id,
      skill: SkillTypeOrmMapper.toDomain(model.skill),
      level: model.level,
      createdAt: model.createdAt,
    });
  }

  static toModel(domain: UserSkill): UserSkillModel {
    const model = new UserSkillModel();
    model.id = domain.getId();
    model.user_id = domain.getUserId();
    model.skill_id = domain.getSkillId();
    model.level = domain.getLevel();
    return model;
  }

  static toDomainList(models: UserSkillModel[]): UserSkill[] {
    return models.map((model) => this.toDomain(model));
  }

  static toModelList(domains: UserSkill[]): UserSkillModel[] {
    return domains.map((domain) => this.toModel(domain));
  }
}
