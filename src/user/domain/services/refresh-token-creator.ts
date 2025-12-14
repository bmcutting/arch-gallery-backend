import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/app/modules/env/services/env';

interface Props {
  id: string;
}

export class RefreshTokenCreator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envServices: EnvService,
  ) {}

  execute({ id }: Props): string {
    return this.jwtService.sign(
      { id: id },
      {
        expiresIn: '20d',
        secret: this.envServices.REFRESH_TOKEN_SECRET_WORD,
      },
    );
  }
}
