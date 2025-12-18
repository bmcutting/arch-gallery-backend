import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { SignInRequest } from './requests/sign-in.request';
import { AccessTokenCreator } from 'src/user/domain/services/access-token-creator';
import { RefreshTokenCreator } from 'src/user/domain/services/refresh-token-creator';
import { SignInResponse } from './responses/sign-in.response';
import { NotFoundUserException } from 'src/user/domain/exceptions/user';
import { PasswordHasher } from 'src/shared/utils/password-hasher';

interface Props {
  request: SignInRequest;
}

export class SignInUserQuery {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accessTokenCreator: AccessTokenCreator,
    private readonly refreshTokenCreator: RefreshTokenCreator,
    private readonly comparator: PasswordHasher,
  ) {}

  async execute({ request }: Props): Promise<SignInResponse> {
    const user = await this.userRepository.findByEmail(request.email);

    if (user && !user.deletedAt) {
      const equal = await this.comparator.compare(
        request.password,
        user.password,
      );

      const accessToken = this.accessTokenCreator.execute({ id: user.id });
      const refreshToken = this.refreshTokenCreator.execute({ id: user.id });

      if (equal) {
        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
          email: user.email,
          id: user.id,
          userName: user.userName,
        };
      }
    }

    throw new NotFoundUserException();
  }
}
