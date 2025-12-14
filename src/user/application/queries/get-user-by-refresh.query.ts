import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { AccessTokenCreator } from 'src/user/domain/services/access-token-creator';
import { RefreshTokenCreator } from 'src/user/domain/services/refresh-token-creator';
import { RefreshTokenVerificator } from 'src/user/domain/services/refresh-token-verificator';
import { SignInResponse } from './responses/sign-in.response';
import { NotFoundUserException } from 'src/user/domain/exceptions/user';

interface Props {
  token: string;
}

export class GetUserByRefreshTokenQuery {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificator: RefreshTokenVerificator,
    private readonly accessTokenCreator: AccessTokenCreator,
    private readonly refreshTokenCreator: RefreshTokenCreator,
  ) {}

  async execute({ token }: Props): Promise<SignInResponse> {
    const payload = this.verificator.execute({ token: token });

    const found = await this.userRepository.findById(payload.id);

    if (found && !found.deletedAt) {
      const accessToken = this.accessTokenCreator.execute({ id: found.id });
      const refreshToken = this.refreshTokenCreator.execute({ id: found.id });

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        email: found.email,
        id: found.id,
        userName: found.userName,
      };
    }

    throw new NotFoundUserException();
  }
}
