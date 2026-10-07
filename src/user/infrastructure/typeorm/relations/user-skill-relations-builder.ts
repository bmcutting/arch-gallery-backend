import { FindOptionsRelations } from 'typeorm';
import { UserSkillModel } from '../models/user-skill.model';
import { SkillRelationsBuilder } from './skill-relations-builder';

export class UserSkillRelationsBuilder {
  static build(): FindOptionsRelations<UserSkillModel> {
    return {
      skill: SkillRelationsBuilder.build(),
    };
  }
}
