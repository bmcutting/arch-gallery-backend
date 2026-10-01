import { Command } from 'src/shared/application/interfaces/command.interface';
import { UnitOfWork } from 'src/shared/domain/interfaces/unit-of-work';
import { TokenService } from 'src/authentication/domain/interfaces/token-service';
import { GenerateRefreshToken } from 'src/authentication/domain/services/refresh-token-generate';
import { RevokeRefreshToken } from 'src/authentication/domain/services/refresh-token-revoke';
import { ValidateRefreshToken } from 'src/authentication/domain/services/refresh-token-validate';
import { InvalidRefreshTokenException } from 'src/authentication/domain/exceptions/authentication';
import { RefreshTokenRequest } from './requests/refresh-token.request';
import { TokenResponse } from './responses/token.response';

interface Props {
  request: RefreshTokenRequest;
}

export class RefreshTokenCommand implements Command<Props, TokenResponse> {
  constructor(
    private readonly validateRefreshToken: ValidateRefreshToken,
    private readonly revokeRefreshToken: RevokeRefreshToken,
    private readonly generateRefreshToken: GenerateRefreshToken,
    private readonly tokenService: TokenService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute({ request }: Props): Promise<TokenResponse> {
    const token = request.refresh_token;
    const user = await this.validateRefreshToken.execute({ token });

    const refreshToken = await this.unitOfWork.run({
      work: async () => {
        // La validacion corre fuera de la unidad, asi que dos refresh
        // concurrentes la pasan los dos; esta revocacion condicional es la
        // que deja rotar solo a uno.
        const revoked = await this.revokeRefreshToken.execute({ token });
        if (!revoked) throw new InvalidRefreshTokenException();

        return this.generateRefreshToken.execute({ userId: user.id });
      },
    });

    return {
      access_token: this.tokenService.sign({ sub: user.id }),
      refresh_token: refreshToken,
      expires_in: this.tokenService.expiresInSeconds(),
      token_type: 'Bearer',
    };
  }
}
