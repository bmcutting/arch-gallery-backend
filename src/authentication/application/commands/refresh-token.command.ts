import {
  GenerateJwtToken,
  TokenResponse,
} from 'src/authentication/domain/services/jwt-token-generate';
import { GenerateRefreshToken } from 'src/authentication/domain/services/refresh-token-generate';
import { RevokeRefreshToken } from 'src/authentication/domain/services/refresh-token-revoke';
import { ValidateRefreshToken } from 'src/authentication/domain/services/refresh-token-validate';
import { Command } from 'src/shared/interfaces/command.interface';

interface Props {
  refreshToken: string;
}

export class RefreshTokenCommand implements Command<Props, TokenResponse> {
  constructor(
    private readonly validateRefreshToken: ValidateRefreshToken,
    private readonly generateJwtToken: GenerateJwtToken,
    private readonly generateRefreshToken: GenerateRefreshToken,
    private readonly revokeRefreshToken: RevokeRefreshToken,
  ) {}

  async execute(props: Props): Promise<TokenResponse> {
    // Validar refresh token
    const user = await this.validateRefreshToken.execute(props.refreshToken);

    // Revocar el refresh token usado (rotación)
    await this.revokeRefreshToken.execute(props.refreshToken);

    // Generar nuevo access token
    const accessTokenResponse = await this.generateJwtToken.execute(user);

    // Generar nuevo refresh token
    const newRefreshToken = await this.generateRefreshToken.execute(user.id);

    return {
      ...accessTokenResponse,
      refresh_token: newRefreshToken,
    };
  }
}
