import { Command } from 'src/shared/application/interfaces/command.interface';
import { UserCreator } from 'src/user/domain/services/user-create';
import { CreateUserRequest } from './requests/create-user.request';
import { CreateUserResponse } from './responses/create-user.response';

interface Props {
  request: CreateUserRequest;
}

export class CreateUserCommand implements Command<Props, CreateUserResponse> {
  constructor(private readonly userCreator: UserCreator) {}

  async execute({ request }: Props): Promise<CreateUserResponse> {
    const id = await this.userCreator.execute({
      email: request.email,
      password: request.password,
      firstName: request.firstName,
      lastName: request.lastName,
      userName: request.userName,
    });

    return { id };
  }
}
