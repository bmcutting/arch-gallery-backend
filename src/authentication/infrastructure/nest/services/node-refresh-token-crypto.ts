import { createHash, randomBytes } from 'node:crypto';
import { RefreshTokenCrypto } from 'src/authentication/domain/interfaces/refresh-token-crypto';

export class NodeRefreshTokenCrypto implements RefreshTokenCrypto {
  generate(): string {
    return randomBytes(64).toString('base64url');
  }

  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
