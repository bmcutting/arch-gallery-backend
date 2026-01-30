import { ValidateJwtToken } from 'src/authentication/domain/services/jwt-token-validate';
import { Command } from 'src/shared/interfaces/command.interface';
import { User } from 'src/user/domain/entities/user.entity';

interface Props {
  token: string;
}

export class ValidateJwtTokenCommand implements Command<Props, User> {
  constructor(private readonly jwtTokenValidateService: ValidateJwtToken) {}

  async execute(props: Props): Promise<User> {
    return await this.jwtTokenValidateService.execute(props.token);
  }
}
