import { Command } from 'src/shared/application/interfaces/command.interface';
import { RevokeRefreshToken } from 'src/authentication/domain/services/refresh-token-revoke';
import { LogoutRequest } from './requests/logout.request';
import { LogoutResponse } from './responses/logout.response';

interface Props {
  request: LogoutRequest;
}

export class LogoutCommand implements Command<Props, LogoutResponse> {
  constructor(private readonly revokeRefreshToken: RevokeRefreshToken) {}

  async execute({ request }: Props): Promise<LogoutResponse> {
    await this.revokeRefreshToken.execute({ token: request.refresh_token });

    return { message: 'Logged out successfully' };
  }
}
