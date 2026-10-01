import { JwtService } from '@nestjs/jwt';
import type { Algorithm } from 'jsonwebtoken';
import { EnvService } from 'src/env/services/env';
import { TokenPayload } from 'src/authentication/domain/interfaces/token-payload';
import { TokenService } from 'src/authentication/domain/interfaces/token-service';

export class JwtTokenService implements TokenService {
  private readonly jwtService = new JwtService();

  constructor(private readonly envService: EnvService) {}

  sign(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.envService.JWT_SECRET,
      expiresIn: this.envService.JWT_EXPIRATION_SECONDS,
      algorithm: this.envService.JWT_ALGORITHM as Algorithm,
    });
  }

  verify(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token, {
      secret: this.envService.JWT_SECRET,
      algorithms: [this.envService.JWT_ALGORITHM as Algorithm],
    });
  }

  expiresInSeconds(): number {
    return this.envService.JWT_EXPIRATION_SECONDS;
  }
}
