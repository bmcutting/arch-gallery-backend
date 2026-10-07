import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { BaseOrderBuilder } from 'src/shared/infrastructure/typeorm/utils/base-order-builder';
import { FindOptionsOrder } from 'typeorm';
import { SkillModel } from '../models/skill.model';
import { SkillSortFields } from 'src/user/domain/enums/skill-sort-fields';

export class SkillOrderBuilder extends BaseOrderBuilder<
  SkillModel,
  SkillSortFields
> {
  protected buildOrder(sortOptions?: SortOption<SkillSortFields>[]): void {
    if (!sortOptions || sortOptions.length === 0) return;

    sortOptions.forEach((sortOption) => {
      if (!sortOption?.field || !sortOption?.direction) return;

      switch (sortOption.field) {
        case SkillSortFields.DISPLAY_NAME:
        case SkillSortFields.CREATED_AT:
          this.order[sortOption.field] = sortOption.direction;
          break;
      }
    });
  }

  // El orden del catalogo no es accidental: sin esto un `take` devuelve lo que quiera Postgres.
  protected getDefaultOrder(): FindOptionsOrder<SkillModel> {
    return { displayName: 'ASC' };
  }

  static build(
    sortOptions?: SortOption<SkillSortFields>[],
  ): FindOptionsOrder<SkillModel> {
    const builder = new SkillOrderBuilder(sortOptions);
    return builder.getOrder();
  }
}
