import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserResponse } from 'src/user/application/queries/responses/user.response';
import { GetAllUsersQuery } from 'src/user/application/queries/get-all-users.query';
import { UserPaginationRequest } from 'src/user/application/queries/requests/user-pagination.request';
import { TypeOrmUserRepository } from '../../typeorm/repository/user';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUserByIdQuery } from 'src/user/application/queries/get-user-by-id.query';
import { CreateUserRequest } from 'src/user/application/commands/requests/create-user.request';
import { UserCreator } from 'src/user/domain/services/user-create';
import { BcryptPasswordHasher } from 'src/shared/utils/password-hasher';
import { CreateUserCommand } from 'src/user/application/commands/create-user.command';
import { UpdateUser } from 'src/user/domain/services/user-update';
import { UpdateUserRequest } from 'src/user/application/commands/requests/update-user.request';
import { UpdateUserCommand } from 'src/user/application/commands/update-user.command';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { JwtAuthGuard } from 'src/authentication/infrastructure/nest/guards/jwt-auth.guard';
import { User } from 'src/user/domain/entities/user.entity';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userRepository: TypeOrmUserRepository) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
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
    const query = new GetUserByIdQuery(this.userRepository);
    return await query.execute({ id: req.user.id });
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description:
      'Permite registrar un nuevo usuario en el sistema con sus datos básicos.',
  })
  @ApiBody({
    type: CreateUserRequest,
    examples: {
      ejemplo1: {
        summary: 'Usuario básico',
        description:
          'Ejemplo de creación de un usuario con datos mínimos requeridos',
        value: {
          email: 'juan.perez@ejemplo.com',
          password: '123456',
          firstName: 'Juan',
          lastName: 'Pérez',
          userName: 'juanperez',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() body: CreateUserRequest) {
    const hasher = new BcryptPasswordHasher();
    const creator = new UserCreator(hasher, this.userRepository);

    const command = new CreateUserCommand(creator);

    return await command.execute(body);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description:
      'Permite modificar los datos de un usuario existente. Se pueden actualizar todos o algunos campos.',
  })
  @ApiParam({ name: 'id', description: 'ID único del usuario', type: String })
  @ApiBody({
    type: UpdateUserRequest,
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
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() body: UpdateUserRequest) {
    const updateUserService = new UpdateUser(this.userRepository);
    const command = new UpdateUserCommand(
      this.userRepository,
      updateUserService,
    );
    return command.execute({ request: { ...body, userId: id } });
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
    @Query() params: UserPaginationRequest,
  ): Promise<PaginationResponse<UserResponse>> {
    const getAllUsersQuery = new GetAllUsersQuery(this.userRepository);
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
    const query = new GetUserByIdQuery(this.userRepository);
    return query.execute({ id });
  }
}

interface RequestWithUser extends Request {
  user: User;
}
