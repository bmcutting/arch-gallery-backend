import { User } from 'src/user/domain/entities/user.entity';
import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { PasswordHasher } from 'src/user/domain/interfaces/password-hasher';
import { TokenService } from '../interfaces/token-service';
import { InvalidCredentialsException } from '../exceptions/authentication';
import { GenerateRefreshToken } from './refresh-token-generate';

interface Props {
  email: string;
  password: string;
}

interface SignInResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

export class SignIn {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly generateRefreshToken: GenerateRefreshToken,
  ) {}

  async execute({ email, password }: Props): Promise<SignInResult> {
    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user || !user.isActive) throw new InvalidCredentialsException();

    const passwordMatches = await this.passwordHasher.compare(
      password,
      user.password,
    );
    if (!passwordMatches) throw new InvalidCredentialsException();

    return {
      user,
      accessToken: this.tokenService.sign({ sub: user.id }),
      refreshToken: await this.generateRefreshToken.execute({
        userId: user.id,
      }),
      expiresInSeconds: this.tokenService.expiresInSeconds(),
    };
  }
}
