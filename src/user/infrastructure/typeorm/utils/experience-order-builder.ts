import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { BaseOrderBuilder } from 'src/shared/infrastructure/typeorm/utils/base-order-builder';
import { FindOptionsOrder } from 'typeorm';
import { ExperienceModel } from '../models/experience.model';
import { ExperienceSortFields } from 'src/user/domain/enums/experience-sort-fields';

export class ExperienceOrderBuilder extends BaseOrderBuilder<
  ExperienceModel,
  ExperienceSortFields
> {
  protected buildOrder(sortOptions?: SortOption<ExperienceSortFields>[]): void {
    if (!sortOptions || sortOptions.length === 0) return;

    sortOptions.forEach((sortOption) => {
      if (!sortOption?.field || !sortOption?.direction) return;

      switch (sortOption.field) {
        case ExperienceSortFields.START_YEAR:
        case ExperienceSortFields.TITLE:
          this.order[sortOption.field] = sortOption.direction;
          break;
      }
    });
  }

  protected getDefaultOrder(): FindOptionsOrder<ExperienceModel> {
    return { startYear: 'DESC' };
  }

  static build(
    sortOptions?: SortOption<ExperienceSortFields>[],
  ): FindOptionsOrder<ExperienceModel> {
    const builder = new ExperienceOrderBuilder(sortOptions);
    return builder.getOrder();
  }
}
