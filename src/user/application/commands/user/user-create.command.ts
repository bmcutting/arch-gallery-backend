import { Command } from 'src/shared/application/interfaces/command.interface';
import { UserCreator } from 'src/user/domain/services/user/user-create';
import { UserResponse } from '../../queries/user/responses/user.response';
import { UserResponseMapper } from '../../mappers/user-response-mapper';
import { UserCreateRequest } from './requests/user-create.request';

interface Props {
  request: UserCreateRequest;
}

export class UserCreateCommand implements Command<Props, UserResponse> {
  constructor(private readonly service: UserCreator) {}

  async execute({ request }: Props): Promise<UserResponse> {
    const user = await this.service.execute({
      email: request.email,
      password: request.password,
      firstName: request.firstName,
      lastName: request.lastName,
      userName: request.userName,
    });

    return UserResponseMapper.toResponse(user);
  }
}
