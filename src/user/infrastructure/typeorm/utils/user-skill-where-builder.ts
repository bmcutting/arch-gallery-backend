import { BaseWhereBuilder } from 'src/shared/infrastructure/typeorm/utils/base-where-builder';
import { FindOptionsWhere } from 'typeorm';
import { WhereUtils } from 'src/shared/infrastructure/typeorm/utils/where-utils';
import { UserSkillModel } from '../models/user-skill.model';
import { UserSkillPaginationParams } from 'src/user/domain/interfaces/user-skill-pagination';

export class UserSkillWhereBuilder extends BaseWhereBuilder<
  UserSkillModel,
  UserSkillPaginationParams
> {
  protected buildWhereConditions(
    where: FindOptionsWhere<UserSkillModel>,
    filters: UserSkillPaginationParams,
  ): FindOptionsWhere<UserSkillModel> {
    where.user_id = filters.userId;
    where.level = WhereUtils.assignIfExists(filters.level);

    // El nombre y el scope viven en el catalogo. `skill` es ManyToOne, no una coleccion, asi que
    // filtrar por la relacion no trunca nada.
    if (filters.name || filters.scope) {
      where.skill = {
        normalizedName: WhereUtils.ilikeUnaccent(filters.name),
        scope: WhereUtils.assignIfExists(filters.scope),
      };
    }

    return where;
  }
}
