import { Body, Controller, Post } from '@nestjs/common';
import { TypeOrmUserRepository } from '../../typeorm/repository/user';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/app/modules/env/services/env';
import { GetUserByTokenRequest } from 'src/user/application/queries/requests/refresh-user.request';
import { SignInResponse } from 'src/user/application/queries/responses/sign-in.response';
import { AccessTokenCreator } from 'src/user/domain/services/access-token-creator';
import { RefreshTokenCreator } from 'src/user/domain/services/refresh-token-creator';
import { RefreshTokenVerificator } from 'src/user/domain/services/refresh-token-verificator';
import { GetUserByRefreshTokenQuery } from 'src/user/application/queries/get-user-by-refresh.query';
import { SignInRequest } from 'src/user/application/queries/requests/sign-in.request';
import { BcryptPasswordHasher } from 'src/shared/utils/password-hasher';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInUserQuery } from 'src/user/application/queries/sign-in.query';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userRepository: TypeOrmUserRepository,
    private readonly jwtServices: JwtService,
    private readonly envService: EnvService,
  ) {}

  @Post('refresh')
  @ApiOperation({
    summary: 'Refrescar sesión de usuario',
    description:
      'Genera nuevos tokens de acceso y refresh a partir de un token de refresh válido.',
  })
  @ApiBody({
    type: GetUserByTokenRequest,
    examples: {
      ejemplo: {
        summary: 'Refrescar tokens',
        description:
          'Ejemplo de cómo refrescar la sesión de un usuario con un token válido',
        value: {
          token:
            '643ae15f04782b0f84e160e9119b6c8ce339a7e0bd5818c3ead6bf8f7d478d275ca36c92114b5ae0415cf5ee1c25e77a71bfe37935ff8d7db25fe2d4ec4f6211',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens generados correctamente',
    type: SignInResponse,
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  async refresh(
    @Body() request: GetUserByTokenRequest,
  ): Promise<SignInResponse> {
    const accessTokenCreator = new AccessTokenCreator(
      this.jwtServices,
      this.envService,
    );
    const refreshTokenCreator = new RefreshTokenCreator(
      this.jwtServices,
      this.envService,
    );
    const refreshTokenVerificator = new RefreshTokenVerificator(
      this.jwtServices,
      this.envService,
    );

    const query = new GetUserByRefreshTokenQuery(
      this.userRepository,
      refreshTokenVerificator,
      accessTokenCreator,
      refreshTokenCreator,
    );

    const user = await query.execute({ token: request.token });

    return user;
  }

  @Post('sign-in')
  @ApiOperation({
    summary: 'Inicio de sesión de usuario',
    description:
      'Autentica a un usuario con email y contraseña, devolviendo tokens de acceso y refresh.',
  })
  @ApiBody({
    type: SignInRequest,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de inicio de sesión',
        description: 'Ejemplo de login de un usuario con email y contraseña',
        value: {
          email: 'juan.perez@ejemplo.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado correctamente',
    type: SignInResponse,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async signIn(@Body() request: SignInRequest): Promise<SignInResponse> {
    const accessTokenCreator = new AccessTokenCreator(
      this.jwtServices,
      this.envService,
    );
    const refreshTokenCreator = new RefreshTokenCreator(
      this.jwtServices,
      this.envService,
    );
    const comparator = new BcryptPasswordHasher();

    const query = new SignInUserQuery(
      this.userRepository,
      accessTokenCreator,
      refreshTokenCreator,
      comparator,
    );

    const user = await query.execute({ request: request });

    return user;
  }
}
