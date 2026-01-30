import * as crypto from 'crypto';

export class TokenHasher {
  static hash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
