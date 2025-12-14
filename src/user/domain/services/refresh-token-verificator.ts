import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from '../token-payload';
import { EnvService } from 'src/app/modules/env/services/env';

interface Props {
  token: string;
}

export class RefreshTokenVerificator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envServices: EnvService,
  ) {}

  execute({ token }: Props): TokenPayload {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: this.envServices.REFRESH_TOKEN_SECRET_WORD,
      });

      return payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
