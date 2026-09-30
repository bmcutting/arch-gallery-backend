import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { ProjectModel } from '../models/project.model';
import { ProjectSortFields } from 'src/project/domain/enums/project-sort-fields';
import { FindOptionsOrder } from 'typeorm';
import { BaseOrderBuilder } from 'src/shared/infrastructure/typeorm/utils/base-order-builder';

export class ProjectOrderBuilder extends BaseOrderBuilder<
  ProjectModel,
  ProjectSortFields
> {
  protected buildOrder(sortOptions?: SortOption<ProjectSortFields>[]): void {
    if (!sortOptions || sortOptions.length === 0) return;

    sortOptions.forEach((sortOption) => {
      if (!sortOption?.field || !sortOption?.direction) return;

      switch (sortOption.field) {
        case ProjectSortFields.TITLE:
          this.order.title = sortOption.direction;
          break;
      }
    });
  }

  static build(
    sortOptions?: SortOption<ProjectSortFields>[],
  ): FindOptionsOrder<ProjectModel> {
    const builder = new ProjectOrderBuilder(sortOptions);
    return builder.getOrder();
  }
}
