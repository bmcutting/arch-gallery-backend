import { FindOptionsRelations } from 'typeorm';
import { UserModel } from '../models/user.model';
import { UserSkillRelationsBuilder } from './user-skill-relations-builder';
import { ExperienceRelationsBuilder } from './experience-relations-builder';

export class UserRelationsBuilder {
  static build(): FindOptionsRelations<UserModel> {
    return {
      skills: UserSkillRelationsBuilder.build(),
      experiences: ExperienceRelationsBuilder.build(),
    };
  }

  // Para los finders que solo comprueban existencia o autentican: no necesitan el perfil.
  static buildWithoutRelations(): FindOptionsRelations<UserModel> {
    return {};
  }
}
