import { Command } from 'src/shared/application/interfaces/command.interface';
import { UserResponseMapper } from 'src/user/application/mappers/user.mapper';
import { SignIn } from 'src/authentication/domain/services/sign-in';
import { LoginRequest } from './requests/login.request';
import { LoginResponse } from './responses/login.response';

interface Props {
  request: LoginRequest;
}

export class SignInCommand implements Command<Props, LoginResponse> {
  constructor(private readonly signIn: SignIn) {}

  async execute({ request }: Props): Promise<LoginResponse> {
    const result = await this.signIn.execute({
      email: request.email,
      password: request.password,
    });

    return {
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
      expires_in: result.expiresInSeconds,
      token_type: 'Bearer',
      user: UserResponseMapper.toResponse(result.user),
    };
  }
}
