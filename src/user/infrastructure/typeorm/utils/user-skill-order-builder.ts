import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { BaseOrderBuilder } from 'src/shared/infrastructure/typeorm/utils/base-order-builder';
import { FindOptionsOrder } from 'typeorm';
import { UserSkillModel } from '../models/user-skill.model';
import { UserSkillSortFields } from 'src/user/domain/enums/user-skill-sort-fields';

export class UserSkillOrderBuilder extends BaseOrderBuilder<
  UserSkillModel,
  UserSkillSortFields
> {
  protected buildOrder(sortOptions?: SortOption<UserSkillSortFields>[]): void {
    if (!sortOptions || sortOptions.length === 0) return;

    sortOptions.forEach((sortOption) => {
      if (!sortOption?.field || !sortOption?.direction) return;

      switch (sortOption.field) {
        case UserSkillSortFields.LEVEL:
        case UserSkillSortFields.CREATED_AT:
          this.order[sortOption.field] = sortOption.direction;
          break;
        // El nombre vive en el catalogo, asi que se ordena por la relacion.
        case UserSkillSortFields.SKILL_NAME:
          this.order.skill = { displayName: sortOption.direction };
          break;
      }
    });
  }

  protected getDefaultOrder(): FindOptionsOrder<UserSkillModel> {
    return { skill: { displayName: 'ASC' } };
  }

  static build(
    sortOptions?: SortOption<UserSkillSortFields>[],
  ): FindOptionsOrder<UserSkillModel> {
    const builder = new UserSkillOrderBuilder(sortOptions);
    return builder.getOrder();
  }
}
