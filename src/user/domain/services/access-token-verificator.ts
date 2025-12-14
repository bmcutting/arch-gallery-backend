import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/app/modules/env/services/env';
import { User } from '../entities/user.entity';
import { TypeOrmUserRepository } from 'src/user/infrastructure/typeorm/repository/user';
import { TokenPayload } from '../token-payload';

interface Props {
  token: string;
}

export class AccessTokenVerificator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envServices: EnvService,
    private readonly userRepository: TypeOrmUserRepository,
  ) {}

  async execute({ token }: Props): Promise<User> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: this.envServices.ACCESS_TOKEN_SECRET_WORD,
      });

      const found = await this.userRepository.findById(payload.id);

      if (found) {
        return found;
      }

      throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException();
    }
  }
}
