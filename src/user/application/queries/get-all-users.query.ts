import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { Query } from 'src/shared/application/interfaces/queries.interface';
import { UserResponse } from './responses/user.response';
import { UserPaginationRequest } from './requests/user-pagination.request';
import { PaginationResponseMapper } from 'src/shared/application/mappers/pagination-mapper';
import { UserResponseMapper } from '../mappers/user.mapper';
import { UserRepository } from 'src/user/domain/repositories/user.repository';

export class GetAllUsersQuery implements Query<
  UserPaginationRequest,
  PaginationResponse<UserResponse>
> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    request: UserPaginationRequest,
  ): Promise<PaginationResponse<UserResponse>> {
    const { items, totalItems, pagination } = await this.userRepository.findAll(
      {
        page: request.page,
        limit: request.limit,
        search: request.search,
        createdAtMin: request.createdAtMin,
        createdAtMax: request.createdAtMax,
        firstName: request.firstName,
        lastName: request.lastName,
        deletedAtMax: request.deletedAtMax,
        deletedAtMin: request.deletedAtMin,
        isActive: request.isActive,
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
