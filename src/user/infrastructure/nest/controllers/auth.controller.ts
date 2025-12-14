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
import { SignInUserQuery } from 'src/user/application/queries/sign-in.request';
import { BcryptPasswordHasher } from 'src/shared/utils/password-hasher';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userRepository: TypeOrmUserRepository,
    private readonly jwtServices: JwtService,
    private readonly envService: EnvService,
  ) {}

  @Post('refresh')
  @ApiBody({
    type: GetUserByTokenRequest,
    examples: {
      example: {
        summary: 'Actualizar todos los campos',
        description: 'Ejemplo de actualización completa de un usuario',
        value: {
          token:
            '643ae15f04782b0f84e160e9119b6c8ce339a7e0bd5818c3ead6bf8f7d478d275ca36c92114b5ae0415cf5ee1c25e77a71bfe37935ff8d7db25fe2d4ec4f6211',
        },
      },
    },
  })
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
  @ApiBody({
    type: SignInRequest,
    examples: {
      example: {
        summary: 'Actualizar todos los campos',
        description: 'Ejemplo de sign-in de un usuario',
        value: {
          email: 'juan.perez@ejemplo.com',
          password: '123456',
        },
      },
    },
  })
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
