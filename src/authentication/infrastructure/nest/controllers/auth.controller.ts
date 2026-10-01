import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnvService } from 'src/env/services/env';
import { UlidGenerator } from 'src/shared/infrastructure/services/ulid.generator';
import { TypeOrmUnitOfWork } from 'src/shared/infrastructure/typeorm/services/typeorm-unit-of-work';
import { BcryptPasswordHasher } from 'src/user/infrastructure/services/bcrypt-password-hasher';
import { TypeOrmUserRepository } from 'src/user/infrastructure/typeorm/repository/user';
import { UserCreator } from 'src/user/domain/services/user-create';
import { CreateUserCommand } from 'src/user/application/commands/create-user.command';
import { CreateUserRequest } from 'src/user/application/commands/requests/create-user.request';
import { CreateUserResponse } from 'src/user/application/commands/responses/create-user.response';
import { RefreshTokenCrypto } from 'src/authentication/domain/interfaces/refresh-token-crypto';
import { TokenService } from 'src/authentication/domain/interfaces/token-service';
import { GenerateRefreshToken } from 'src/authentication/domain/services/refresh-token-generate';
import { RevokeRefreshToken } from 'src/authentication/domain/services/refresh-token-revoke';
import { ValidateRefreshToken } from 'src/authentication/domain/services/refresh-token-validate';
import { SignIn } from 'src/authentication/domain/services/sign-in';
import { SignInCommand } from 'src/authentication/application/commands/sign-in.command';
import { LogoutCommand } from 'src/authentication/application/commands/logout.command';
import { RefreshTokenCommand } from 'src/authentication/application/commands/refresh-token.command';
import { LoginRequest } from 'src/authentication/application/commands/requests/login.request';
import { LogoutRequest } from 'src/authentication/application/commands/requests/logout.request';
import { RefreshTokenRequest } from 'src/authentication/application/commands/requests/refresh-token.request';
import { LoginResponse } from 'src/authentication/application/commands/responses/login.response';
import { LogoutResponse } from 'src/authentication/application/commands/responses/logout.response';
import { TokenResponse } from 'src/authentication/application/commands/responses/token.response';
import { TypeOrmRefreshTokenRepository } from '../../typeorm/repositories/refresh-token.repository';
import { JwtTokenService } from '../services/jwt-token-service';
import { NodeRefreshTokenCrypto } from '../services/node-refresh-token-crypto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly tokenService: TokenService = new JwtTokenService(
    this.envService,
  );
  private readonly crypto: RefreshTokenCrypto = new NodeRefreshTokenCrypto();

  private readonly generateRefreshToken = new GenerateRefreshToken(
    this.refreshTokenRepository,
    this.idGenerator,
    this.crypto,
    this.envService.REFRESH_TOKEN_EXPIRATION_SECONDS,
  );
  private readonly revokeRefreshToken = new RevokeRefreshToken(
    this.refreshTokenRepository,
    this.crypto,
  );

  constructor(
    private readonly envService: EnvService,
    private readonly userRepository: TypeOrmUserRepository,
    private readonly refreshTokenRepository: TypeOrmRefreshTokenRepository,
    private readonly passwordHasher: BcryptPasswordHasher,
    private readonly idGenerator: UlidGenerator,
    private readonly unitOfWork: TypeOrmUnitOfWork,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login de usuario',
    description: 'Autentica un usuario con email y contraseña.',
  })
  @ApiBody({
    type: LoginRequest,
    examples: {
      user: {
        summary: 'Usuario',
        value: { email: 'usuario@ejemplo.com', password: '12345678' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Login exitoso',
    type: LoginResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'invalid-credentials: correo o contraseña incorrectos',
  })
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const signIn = new SignIn(
      this.userRepository,
      this.passwordHasher,
      this.tokenService,
      this.generateRefreshToken,
    );

    return new SignInCommand(signIn).execute({ request: body });
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refrescar el par de tokens',
    description:
      'Emite un access token y un refresh token nuevos, y **revoca el refresh token usado**. Las dos escrituras van en una transacción.',
  })
  @ApiBody({
    type: RefreshTokenRequest,
    examples: {
      refresh: {
        summary: 'Refrescar token',
        value: { refresh_token: 'kMx7K...' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Par de tokens nuevo',
    type: TokenResponse,
  })
  @ApiResponse({
    status: 401,
    description:
      'invalid-refresh-token: no existe, está caducado o ya fue revocado',
  })
  async refresh(@Body() body: RefreshTokenRequest): Promise<TokenResponse> {
    const validateRefreshToken = new ValidateRefreshToken(
      this.refreshTokenRepository,
      this.userRepository,
      this.crypto,
    );

    const command = new RefreshTokenCommand(
      validateRefreshToken,
      this.revokeRefreshToken,
      this.generateRefreshToken,
      this.tokenService,
      this.unitOfWork,
    );

    return command.execute({ request: body });
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Revoca el refresh token. El access token sigue válido hasta caducar.',
  })
  @ApiBody({
    type: LogoutRequest,
    examples: {
      logout: {
        summary: 'Cerrar sesión',
        value: { refresh_token: 'kMx7K...' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Sesión cerrada',
    type: LogoutResponse,
  })
  async logout(@Body() body: LogoutRequest): Promise<LogoutResponse> {
    return new LogoutCommand(this.revokeRefreshToken).execute({
      request: body,
    });
  }

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un usuario',
    description: 'Crea el usuario',
  })
  @ApiBody({
    type: CreateUserRequest,
    examples: {
      basico: {
        summary: 'Usuario básico',
        value: {
          email: 'juan.perez@ejemplo.com',
          password: '12345678',
          firstName: 'Juan',
          lastName: 'Pérez',
          userName: 'juanperez',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado',
    type: CreateUserResponse,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un usuario con ese correo o nombre de usuario',
  })
  async register(@Body() body: CreateUserRequest): Promise<CreateUserResponse> {
    const userCreator = new UserCreator(
      this.passwordHasher,
      this.userRepository,
    );

    return new CreateUserCommand(userCreator).execute({ request: body });
  }
}
