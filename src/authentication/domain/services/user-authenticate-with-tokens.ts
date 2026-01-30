import { User } from 'src/user/domain/entities/user.entity';
import { GenerateJwtToken, TokenResponse } from './jwt-token-generate';
import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { PasswordHasher } from 'src/shared/utils/password-hasher';
import { GenerateRefreshToken } from './refresh-token-generate';
import { InvalidCredentialsException } from 'src/shared/domain/exceptions/invalid-credentials.exception';

export interface AuthenticateUserResponse extends TokenResponse {
  user: User;
}

export class AuthenticateUserWithTokens {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtTokenGenerate: GenerateJwtToken,
    private readonly refreshTokenGenerate: GenerateRefreshToken,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (!user.isActive) {
      throw new InvalidCredentialsException();
    }

    // Comparar contraseñas
    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Generar access token
    const accessTokenResponse = await this.jwtTokenGenerate.execute(user);

    // Generar refresh token
    const refreshToken = await this.refreshTokenGenerate.execute(user.id);

    return {
      ...accessTokenResponse,
      refresh_token: refreshToken,
      user,
    };
  }
}
