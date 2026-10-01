import { RefreshToken } from '../entities/refresh-token.entity';

export interface RefreshTokenRepository {
  create(refreshToken: RefreshToken): Promise<void>;
  findByToken(hashedToken: string): Promise<RefreshToken | null>;
  revokeByToken(hashedToken: string): Promise<boolean>;
  deleteExpired(): Promise<void>;
}
