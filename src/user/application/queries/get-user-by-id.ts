import { Query } from 'src/shared/interfaces/queries.interface';
import { GetUserByIdRequest } from './requests/user-get-by-id.request';
import { UserResponse } from './responses/user.response';
import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { UserResponseMapper } from '../mappers/user.mapper';
import { NotFoundException } from '@nestjs/common';

export class GetUserByIdQuery implements Query<
  GetUserByIdRequest,
  Promise<UserResponse>
> {
  constructor(private readonly repository: UserRepository) {}

  async execute({ id }: GetUserByIdRequest): Promise<UserResponse> {
    const found = await this.repository.findById(id);

    if (found && !found.deletedAt) {
      return UserResponseMapper.toResponse(found);
    }

    throw new NotFoundException();
  }
}
