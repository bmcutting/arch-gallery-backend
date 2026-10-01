import { User } from 'src/user/domain/entities/user.entity';
import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { RefreshTokenCrypto } from '../interfaces/refresh-token-crypto';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { InvalidRefreshTokenException } from '../exceptions/authentication';

interface Props {
  token: string;
}

export class ValidateRefreshToken {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly crypto: RefreshTokenCrypto,
  ) {}

  async execute({ token }: Props): Promise<User> {
    const refreshToken = await this.refreshTokenRepository.findByToken(
      this.crypto.hash(token),
    );

    if (!refreshToken || !refreshToken.isValid()) {
      throw new InvalidRefreshTokenException();
    }

    const user = await this.userRepository.findById(refreshToken.userId);
    if (!user || !user.isActive) throw new InvalidRefreshTokenException();

    return user;
  }
}
