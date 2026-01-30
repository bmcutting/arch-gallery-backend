import { RefreshToken } from '../entities/refresh-token.entity';

export interface RefreshTokenRepository {
  create(refreshToken: RefreshToken): Promise<void>;
  findByToken(hashedToken: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  revokeByUserId(userId: string): Promise<void>;
  revokeByToken(hashedToken: string): Promise<void>;
  deleteExpired(): Promise<void>;
}
