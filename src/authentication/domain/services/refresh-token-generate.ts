import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenCrypto } from '../interfaces/refresh-token-crypto';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import IdGenerator from 'src/shared/domain/interfaces/id.generator';

interface Props {
  userId: string;
}

export class GenerateRefreshToken {
  constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly idGenerator: IdGenerator,
    private readonly crypto: RefreshTokenCrypto,
    private readonly expirationSeconds: number,
  ) {}

  async execute({ userId }: Props): Promise<string> {
    const token = this.crypto.generate();

    const refreshToken = new RefreshToken({
      id: this.idGenerator.create(),
      userId,
      token: this.crypto.hash(token),
      expiresAt: new Date(Date.now() + this.expirationSeconds * 1000),
      isRevoked: false,
    });

    await this.repository.create(refreshToken);

    return token;
  }
}
