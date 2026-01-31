import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmUserRepository } from 'src/user/infrastructure/typeorm/repository/user';
import { TypeOrmRefreshTokenRepository } from '../../typeorm/repositories/refresh-token.repository';
import { BcryptPasswordHasher } from 'src/shared/utils/password-hasher';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GenerateJwtToken,
  TokenResponse,
} from 'src/authentication/domain/services/jwt-token-generate';
import { GenerateTokenRequest } from 'src/authentication/application/commands/requests/generate-token.request';
import { User } from 'src/user/domain/entities/user.entity';
import { GenerateJwtTokenCommand } from 'src/authentication/application/commands/generate-jwt-token.command';
import { LoginRequest } from 'src/authentication/application/commands/requests/login.request';
import { LoginResponse } from 'src/authentication/application/commands/responses/login.response';
import { GenerateRefreshToken } from 'src/authentication/domain/services/refresh-token-generate';
import { AuthenticateUserWithTokens } from 'src/authentication/domain/services/user-authenticate-with-tokens';
import { LoginCommand } from 'src/authentication/application/commands/login.command';
import { RevokeRefreshToken } from 'src/authentication/domain/services/refresh-token-revoke';
import { LogoutCommand } from 'src/authentication/application/commands/logout.command';
import { LogoutRequest } from 'src/authentication/application/commands/requests/logout.request';
import { RefreshTokenCommand } from 'src/authentication/application/commands/refresh-token.command';
import { RefreshTokenRequest } from 'src/authentication/application/commands/requests/refresh-token.request';
import { ValidateRefreshToken } from 'src/authentication/domain/services/refresh-token-validate';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    @Inject()
    private readonly configService: ConfigService,
    @Inject()
    private readonly userRepository: TypeOrmUserRepository,
    @Inject()
    private readonly refreshTokenRepository: TypeOrmRefreshTokenRepository,
    @Inject()
    private readonly passwordHasher: BcryptPasswordHasher,
  ) {}

  @Post('generate-token')
  @ApiOperation({
    summary: 'Generar token JWT',
    description: 'Genera un token JWT para el usuario especificado.',
  })
  @ApiBody({
    type: GenerateTokenRequest,
    examples: {
      user: {
        summary: 'Usuario',
        value: {
          userId: '01HQK8R7N5P3Z9QX1A2B4C6D8E',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userName: 'johndoe',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Token generado exitosamente' })
  async generateToken(
    @Body() body: GenerateTokenRequest,
  ): Promise<TokenResponse> {
    const user = new User({
      id: body.userId,
      email: body.email,
      password: '',
      firstName: body.firstName || '',
      lastName: body.lastName || '',
      userName: body.userName || '',
      isActive: true,
    });

    const jwtTokenGenerateService = new GenerateJwtToken(
      this.jwtService,
      this.configService,
    );
    const command = new GenerateJwtTokenCommand(jwtTokenGenerateService);

    return await command.execute({ user });
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refrescar access token',
    description:
      'Genera un nuevo access token y refresh token usando un refresh token válido',
  })
  @ApiBody({
    type: RefreshTokenRequest,
    examples: {
      refresh: {
        summary: 'Refrescar token',
        value: {
          refresh_token: 'kMx7K...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token refrescado exitosamente',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'new_kMx7K...',
      expires_in: 3600,
      token_type: 'Bearer',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
  })
  async refresh(@Body() body: RefreshTokenRequest): Promise<TokenResponse> {
    const validateRefreshTokenService = new ValidateRefreshToken(
      this.refreshTokenRepository,
      this.userRepository,
    );

    const jwtTokenGenerateService = new GenerateJwtToken(
      this.jwtService,
      this.configService,
    );

    const refreshTokenGenerateService = new GenerateRefreshToken(
      this.configService,
      this.refreshTokenRepository,
    );

    const revokeRefreshTokenService = new RevokeRefreshToken(
      this.refreshTokenRepository,
    );

    const command = new RefreshTokenCommand(
      validateRefreshTokenService,
      jwtTokenGenerateService,
      refreshTokenGenerateService,
      revokeRefreshTokenService,
    );

    return await command.execute({
      refreshToken: body.refresh_token,
    });
  }

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
        value: {
          email: 'usuario@ejemplo.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: LoginResponse,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const jwtTokenGenerateService = new GenerateJwtToken(
      this.jwtService,
      this.configService,
    );

    const refreshTokenGenerateService = new GenerateRefreshToken(
      this.configService,
      this.refreshTokenRepository,
    );

    const authenticateUserService = new AuthenticateUserWithTokens(
      this.userRepository,
      this.passwordHasher,
      jwtTokenGenerateService,
      refreshTokenGenerateService,
    );

    const command = new LoginCommand(authenticateUserService);

    return await command.execute({
      email: body.email,
      password: body.password,
    });
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Cerrar sesión',
    description: 'Revoca el refresh token del usuario',
  })
  @ApiBody({
    type: LogoutRequest,
    examples: {
      logout: {
        summary: 'Cerrar sesión',
        value: {
          refresh_token: 'kMx7K...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión cerrada exitosamente',
    example: { message: 'Logged out successfully' },
  })
  async logout(@Body() body: LogoutRequest): Promise<{ message: string }> {
    const revokeRefreshTokenService = new RevokeRefreshToken(
      this.refreshTokenRepository,
    );

    const command = new LogoutCommand(revokeRefreshTokenService);

    await command.execute({
      refreshToken: body.refresh_token,
    });

    return { message: 'Logged out successfully' };
  }
}
