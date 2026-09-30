import { BaseWhereBuilder } from 'src/shared/infrastructure/typeorm/utils/base-where-builder';
import { UserModel } from '../models/user.model';
import { UserPaginationParams } from 'src/user/domain/interfaces/user-pagination';
import { FindOptionsWhere } from 'typeorm';
import { WhereUtils } from 'src/shared/infrastructure/typeorm/utils/where-utils';

export class UserWhereBuilder extends BaseWhereBuilder<
  UserModel,
  UserPaginationParams
> {
  protected buildWhereConditions(
    where: FindOptionsWhere<UserModel>,
    filters: UserPaginationParams,
  ): FindOptionsWhere<UserModel> | FindOptionsWhere<UserModel>[] {
    this.applyStandardFilters(where, filters);

    if (filters.search) {
      return this.createSearchConditions(filters.search, where);
    }
    return where;
  }

  private applyStandardFilters(
    where: FindOptionsWhere<UserModel>,
    filters: UserPaginationParams,
  ): void {
    where.firstName = WhereUtils.ilikeUnaccent(filters.firstName);
    where.lastName = WhereUtils.ilikeUnaccent(filters.lastName);
    where.userName = WhereUtils.ilikeUnaccent(filters.userName);
    where.email = WhereUtils.ilikeUnaccent(filters.email);
    where.createdAt = WhereUtils.dateRange(
      filters.createdAtMin,
      filters.createdAtMax,
    );
    return;
  }

  private createSearchConditions(
    search: string,
    baseWhere: FindOptionsWhere<UserModel>,
  ): FindOptionsWhere<UserModel>[] {
    const searchConditions: FindOptionsWhere<UserModel>[] = [];

    searchConditions.push({
      ...baseWhere,
      firstName: WhereUtils.ilikeUnaccent(search),
    });

    searchConditions.push({
      ...baseWhere,
      lastName: WhereUtils.ilikeUnaccent(search),
    });

    searchConditions.push({
      ...baseWhere,
      email: WhereUtils.ilikeUnaccent(search),
    });

    searchConditions.push({
      ...baseWhere,
      userName: WhereUtils.ilikeUnaccent(search),
    });

    return searchConditions;
  }
}
