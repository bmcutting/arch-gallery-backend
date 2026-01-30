import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { User } from 'src/user/domain/entities/user.entity';
import { TokenHasher } from './token-hasher';
import { InvalidRefreshTokenException } from 'src/shared/domain/exceptions/invalid-refresh-token.exception';

export class ValidateRefreshToken {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(token: string): Promise<User> {
    const hashedToken = TokenHasher.hash(token);

    const refreshToken =
      await this.refreshTokenRepository.findByToken(hashedToken);

    if (!refreshToken) {
      throw new InvalidRefreshTokenException();
    }

    if (!refreshToken.isValid()) {
      throw new InvalidRefreshTokenException();
    }

    const user = await this.userRepository.findById(refreshToken.userId);

    if (!user || !user.isActive) {
      throw new InvalidRefreshTokenException();
    }

    return user;
  }
}
