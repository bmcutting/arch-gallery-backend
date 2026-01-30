import { RevokeRefreshToken } from 'src/authentication/domain/services/refresh-token-revoke';
import { Command } from 'src/shared/interfaces/command.interface';

interface Props {
  refreshToken: string;
}

export class LogoutCommand implements Command<Props, void> {
  constructor(private readonly revokeRefreshToken: RevokeRefreshToken) {}

  async execute(props: Props): Promise<void> {
    await this.revokeRefreshToken.execute(props.refreshToken);
  }
}
