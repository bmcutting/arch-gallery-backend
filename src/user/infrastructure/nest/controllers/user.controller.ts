import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { UserResponse } from 'src/user/application/queries/user/responses/user.response';
import { UserGetAllQuery } from 'src/user/application/queries/user/user-get-all.query';
import { UserGetAllRequest } from 'src/user/application/queries/user/requests/user-get-all.request';
import { TypeOrmUserRepository } from '../../typeorm/repositories/user.repository';
import { UlidGenerator } from 'src/shared/infrastructure/services/ulid.generator';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserGetByIdQuery } from 'src/user/application/queries/user/user-get-by-id.query';
import { UpdateUser } from 'src/user/domain/services/user/user-update';
import { UserUpdateRequest } from 'src/user/application/commands/user/requests/user-update.request';
import { UserUpdateCommand } from 'src/user/application/commands/user/user-update.command';
import { UserChangePasswordRequest } from 'src/user/application/commands/user/requests/user-change-password.request';
import { UserChangePasswordCommand } from 'src/user/application/commands/user/user-change-password.command';
import { UserChangePassword } from 'src/user/domain/services/user/user-change-password';
import { BcryptPasswordHasher } from 'src/user/infrastructure/services/bcrypt-password-hasher';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { Auth } from 'src/authentication/infrastructure/nest/decorators/auth.decorator';
import { User } from 'src/user/domain/entities/user.entity';
import { TypeOrmUnitOfWork } from 'src/shared/infrastructure/typeorm/services/typeorm-unit-of-work';
import { SimpleTextNormalizer } from 'src/shared/domain/services/simple-text.normalizer';
import { UserSkillSync } from 'src/user/domain/services/user-skill/user-skill-sync';
import { ExperienceSync } from 'src/user/domain/services/experience/experience-sync';
import { SkillResolve } from 'src/user/domain/services/skill/skill-resolve';
import { SkillFindById } from 'src/user/domain/services/skill/skill-find-by-id';
import { TypeOrmSkillRepository } from '../../typeorm/repositories/skill.repository';
import { TypeOrmUserSkillRepository } from '../../typeorm/repositories/user-skill.repository';
import { TypeOrmExperienceRepository } from '../../typeorm/repositories/experience.repository';

@ApiTags('Users')
@Controller('users')
@Auth()
export class UserController {
  constructor(
    private readonly userRepository: TypeOrmUserRepository,
    private readonly skillRepository: TypeOrmSkillRepository,
    private readonly userSkillRepository: TypeOrmUserSkillRepository,
    private readonly experienceRepository: TypeOrmExperienceRepository,
    private readonly unitOfWork: TypeOrmUnitOfWork,
    private readonly ids: UlidGenerator,
  ) {}

  @Get('me')
  @ApiOperation({
    summary: 'Obtener el usuario autenticado',
    description:
      'Devuelve la información del usuario autenticado a partir del token JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado encontrado',
    type: UserResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o no proporcionado',
  })
  async getMe(@Req() req: RequestWithUser): Promise<UserResponse> {
    const query = new UserGetByIdQuery(this.userRepository);
    return await query.execute({ id: req.user.id });
  }

  @Patch('change-password')
  @ApiOperation({
    summary: 'Cambiar la contraseña del usuario autenticado',
    description: 'Exige la contraseña actual para confirmar el cambio.',
  })
  @ApiBody({ type: UserChangePasswordRequest })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada' })
  @ApiResponse({
    status: 409,
    description: 'not-equal-passwords: la contraseña actual no coincide',
  })
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() body: UserChangePasswordRequest,
  ): Promise<void> {
    const service = new UserChangePassword(
      this.userRepository,
      new BcryptPasswordHasher(),
    );
    const command = new UserChangePasswordCommand(this.userRepository, service);

    return await command.execute({
      request: body,
      currentUserId: req.user.id,
    });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description:
      'Permite modificar los datos de un usuario existente. Se pueden actualizar todos o algunos campos.',
  })
  @ApiParam({ name: 'id', description: 'ID único del usuario', type: String })
  @ApiBody({
    type: UserUpdateRequest,
    examples: {
      ejemplo1: {
        summary: 'Actualizar todos los campos',
        description: 'Ejemplo de actualización completa de un usuario',
        value: {
          email: 'maria.lopez@ejemplo.com',
          firstName: 'María',
          lastName: 'López',
          userName: 'maria.arq',
          phoneNumber: '+43 54323454',
          bio: 'Arquitecta especializada en urbanismo sostenible y diseño de espacios públicos.',
          profileImageUrl: 'http://tuimagen.com/maria.jpg',
          website: 'https://www.misitoweb.com',
          location: 'Madrid, España',
          experienceYears: 8,
          specialization: 'Urbanismo',
          instagramUrl: 'https://instagram.com/maria.arquitecta',
          twitterUrl: 'https://twitter.com/maria_arq',
          linkedinUrl: 'https://linkedin.com/in/maria-lopez-arquitecta',
          languages: ['Español', 'Inglés', 'Francés'],
        },
      },
      ejemplo2: {
        summary: 'Actualizar email y nombre',
        description: 'Ejemplo de actualización parcial de un usuario',
        value: {
          email: 'carlos.gonzalez@ejemplo.com',
          firstName: 'Carlos',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() body: UserUpdateRequest,
  ): Promise<UserResponse> {
    const command = new UserUpdateCommand(
      this.userRepository,
      new UpdateUser(this.userRepository),
      new UserSkillSync(
        this.userSkillRepository,
        new SkillResolve(
          this.skillRepository,
          new SkillFindById(this.skillRepository),
          new SimpleTextNormalizer(),
          this.ids,
        ),
        this.ids,
      ),
      new ExperienceSync(this.experienceRepository, this.ids),
    );

    // Escribe tres tablas si llegan skills y experiencias.
    return await this.unitOfWork.run({
      work: async () =>
        await command.execute({
          request: body,
          id,
          currentUserId: req.user.id,
        }),
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description:
      'Devuelve una lista paginada de todos los usuarios registrados en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    type: [UserResponse],
  })
  async getUsers(
    @Query() params: UserGetAllRequest,
  ): Promise<PaginationResponse<UserResponse>> {
    const getAllUsersQuery = new UserGetAllQuery(this.userRepository);
    const paginationResponse = await getAllUsersQuery.execute(params);
    return paginationResponse;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un usuario por Id',
    description:
      'Devuelve la información de un usuario específico a partir de su identificador único.',
  })
  @ApiParam({ name: 'id', description: 'Id único del usuario', type: String })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: UserResponse,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findById(@Param('id') id: string): Promise<UserResponse> {
    const query = new UserGetByIdQuery(this.userRepository);
    return query.execute({ id });
  }
}

export interface RequestWithUser extends Request {
  user: User;
}
