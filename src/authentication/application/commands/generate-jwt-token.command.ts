import {
  GenerateJwtToken,
  TokenResponse,
} from 'src/authentication/domain/services/jwt-token-generate';
import { Command } from 'src/shared/interfaces/command.interface';
import { User } from 'src/user/domain/entities/user.entity';

interface Props {
  user: User;
}

export class GenerateJwtTokenCommand implements Command<Props, TokenResponse> {
  constructor(private readonly jwtTokenGenerateService: GenerateJwtToken) {}

  async execute(props: Props): Promise<TokenResponse> {
    return await this.jwtTokenGenerateService.execute(props.user);
  }
}
