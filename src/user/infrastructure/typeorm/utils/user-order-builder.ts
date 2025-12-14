import { UserSortFields } from 'src/user/domain/enums/user-sort-fields';
import { UserModel } from '../models/user';
import { SortOption } from 'src/shared/domain/interfaces/sort-option';
import { FindOptionsOrder } from 'typeorm';
import { BaseOrderBuilder } from 'src/shared/utils/base-order-builder';

export class UserOrderBuilder extends BaseOrderBuilder<
  UserModel,
  UserSortFields
> {
  protected buildOrder(sortOptions?: SortOption<UserSortFields>[]): void {
    if (!sortOptions || sortOptions.length === 0) return;

    sortOptions.forEach((sortOption) => {
      if (!sortOption?.field || !sortOption?.direction) return;

      switch (sortOption.field) {
        case UserSortFields.EMAIL:
          this.order.email = sortOption.direction;
          break;
        case UserSortFields.FIRST_NAME:
          this.order.firstName = sortOption.direction;
          break;
        case UserSortFields.LAST_NAME:
          this.order.lastName = sortOption.direction;
          break;
        case UserSortFields.USER_NAME:
          this.order.userName = sortOption.direction;
          break;
      }
    });
  }

  protected getDefaultOrder(): FindOptionsOrder<UserModel> {
    return { createdAt: 'DESC' };
  }

  static build(
    sortOptions?: SortOption<UserSortFields>[],
  ): FindOptionsOrder<UserModel> {
    const builder = new UserOrderBuilder(sortOptions);
    return builder.getOrder();
  }
}
