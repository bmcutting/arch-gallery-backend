import { RefreshTokenCrypto } from '../interfaces/refresh-token-crypto';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

interface Props {
  token: string;
}

export class RevokeRefreshToken {
  constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly crypto: RefreshTokenCrypto,
  ) {}

  async execute({ token }: Props): Promise<boolean> {
    return this.repository.revokeByToken(this.crypto.hash(token));
  }
}
