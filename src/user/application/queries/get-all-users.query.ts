import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { Query } from 'src/shared/interfaces/queries.interface';
import { UserResponse } from './responses/user.response';
import { UserPaginationRequest } from './requests/user-pagination.request';
import { PaginationResponseMapper } from 'src/shared/application/mappers/pagination-mapper';
import { UserResponseMapper } from '../mappers/user.mapper';
import { TypeOrmUserRepository } from 'src/user/infrastructure/typeorm/repository/user';

export class GetAllUsersQuery implements Query<
  UserPaginationRequest,
  Promise<PaginationResponse<UserResponse>>
> {
  constructor(private readonly userRepository: TypeOrmUserRepository) {}

  async execute(
    request: UserPaginationRequest,
  ): Promise<PaginationResponse<UserResponse>> {
    const { items, totalItems, pagination } = await this.userRepository.findAll(
      {
        page: request.page,
        pageSize: request.pageSize,
        search: request.search,
        createdAtMin: request.createdAtMin,
        createdAtMax: request.createdAtMax,
        firstName: request.firstName,
        lastName: request.lastName,
        deletedAtMax: request.deletedAtMax,
        deletedAtMin: request.deletedAtMin,
        includeDeleted: request.includeDeleted,
        onlyDeleted: request.onlyDeleted,
        sort: request.sort,
      },
    );

    return PaginationResponseMapper.toResponse({
      items: UserResponseMapper.toResponseList(items),
      totalItems,
      ...pagination,
    });
  }
}
