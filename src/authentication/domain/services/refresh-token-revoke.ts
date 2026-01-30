import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { TokenHasher } from './token-hasher';

export class RevokeRefreshToken {
  constructor(private readonly repository: RefreshTokenRepository) {}

  async execute(token: string): Promise<void> {
    const hashedToken = TokenHasher.hash(token);
    await this.repository.revokeByToken(hashedToken);
  }

  async executeByUserId(userId: string): Promise<void> {
    await this.repository.revokeByUserId(userId);
  }
}
