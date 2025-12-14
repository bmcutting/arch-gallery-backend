import { Command } from 'src/shared/interfaces/command.interface';
import { CreateUserRequest } from './requests/create-user.request';
import { CreateUserResponse } from './responses/create-user.response';
import { UserCreator } from 'src/user/domain/services/user-create';

export class CreateUserCommand implements Command<
  CreateUserRequest,
  CreateUserResponse
> {
  constructor(private readonly createUserService: UserCreator) {}

  async execute(props: CreateUserRequest): Promise<CreateUserResponse> {
    const userId = await this.createUserService.execute({
      email: props.email,
      password: props.password,
      firstName: props.firstName,
      lastName: props.lastName,
      userName: props.userName,
    });

    return { id: userId };
  }
}
