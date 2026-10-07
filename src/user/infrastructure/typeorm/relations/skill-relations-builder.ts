import { FindOptionsRelations } from 'typeorm';
import { SkillModel } from '../models/skill.model';

export class SkillRelationsBuilder {
  static build(): FindOptionsRelations<SkillModel> {
    return {};
  }
}
