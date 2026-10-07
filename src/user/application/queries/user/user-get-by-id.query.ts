import { Query } from 'src/shared/application/interfaces/queries.interface';
import { GetUserByIdRequest } from './requests/user-get-by-id.request';
import { UserResponse } from './responses/user.response';
import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { UserResponseMapper } from '../../mappers/user-response-mapper';
import { NotFoundUserException } from 'src/user/domain/exceptions/user';

export class UserGetByIdQuery implements Query<
  GetUserByIdRequest,
  UserResponse
> {
  constructor(private readonly repository: UserRepository) {}

  async execute({ id }: GetUserByIdRequest): Promise<UserResponse> {
    const found = await this.repository.findById(id);

    if (found && !found.deletedAt) {
      return UserResponseMapper.toResponse(found);
    }

    throw new NotFoundUserException();
  }
}
