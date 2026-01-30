import { ConfigService } from '@nestjs/config';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import * as crypto from 'crypto';
import { TokenHasher } from './token-hasher';
import { RefreshToken } from '../entities/refresh-token.entity';

export class GenerateRefreshToken {
  constructor(
    private readonly configService: ConfigService,
    private readonly repository: RefreshTokenRepository,
  ) {}

  async execute(userId: string): Promise<string> {
    const token = this.generateSecureToken();

    const expirationTime = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION_TIME',
    );

    const expiresAt = this.calculateExpirationDate(expirationTime || '30d');

    const hashedToken = TokenHasher.hash(token);

    const refreshToken = new RefreshToken({
      id: '',
      userId,
      token: hashedToken,
      expiresAt,
      isRevoked: false,
    });

    await this.repository.create(refreshToken);

    return token;
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(64).toString('base64url');
  }

  private calculateExpirationDate(expirationTime: string): Date {
    const timeValue = parseInt(expirationTime.slice(0, -1));
    const timeUnit = expirationTime.slice(-1);

    let milliseconds = 0;

    switch (timeUnit) {
      case 's':
        milliseconds = timeValue * 1000;
        break;
      case 'm':
        milliseconds = timeValue * 60 * 1000;
        break;
      case 'h':
        milliseconds = timeValue * 3600 * 1000;
        break;
      case 'd':
        milliseconds = timeValue * 86400 * 1000;
        break;
      default:
        milliseconds = 30 * 86400 * 1000; // 30 días por defecto
    }

    return new Date(Date.now() + milliseconds);
  }
}
