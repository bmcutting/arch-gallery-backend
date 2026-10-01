import { RefreshToken } from '../entities/refresh-token.entity';

export interface RefreshTokenRepository {
  create(refreshToken: RefreshToken): Promise<void>;
  findByToken(hashedToken: string): Promise<RefreshToken | null>;
  revokeByToken(hashedToken: string): Promise<void>;
  /** Sin llamador todavía: el job que la use es de la Fase 9. */
  deleteExpired(): Promise<void>;
}
