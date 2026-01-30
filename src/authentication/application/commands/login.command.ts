import { Command } from 'src/shared/interfaces/command.interface';
import { LoginResponse } from './responses/login.response';
import { AuthenticateUserWithTokens } from 'src/authentication/domain/services/user-authenticate-with-tokens';
import { UserResponseMapper } from 'src/user/application/mappers/user.mapper';

interface Props {
  email: string;
  password: string;
}

export class LoginCommand implements Command<Props, LoginResponse> {
  constructor(
    private readonly authenticateUserService: AuthenticateUserWithTokens,
  ) {}

  async execute(props: Props): Promise<LoginResponse> {
    const result = await this.authenticateUserService.execute(
      props.email,
      props.password,
    );

    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_in: result.expires_in,
      token_type: result.token_type,
      user: UserResponseMapper.toResponse(result.user),
    };
  }
}
