import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserResponse } from 'src/user/application/queries/responses/user.response';
import { GetAllUsersQuery } from 'src/user/application/queries/get-all-users.query';
import { UserPaginationRequest } from 'src/user/application/queries/requests/user-pagination.request';
import { TypeOrmUserRepository } from '../../typeorm/repository/user';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetUserByIdQuery } from 'src/user/application/queries/get-user-by-id';
import { CreateUserRequest } from 'src/user/application/commands/requests/create-user.request';
import { UserCreator } from 'src/user/domain/services/user-create';
import { BcryptPasswordHasher } from 'src/shared/utils/password-hasher';
import { CreateUserCommand } from 'src/user/application/commands/create-user.command';
import { UpdateUser } from 'src/user/domain/services/user-update';
import { UpdateUserRequest } from 'src/user/application/commands/requests/update-user.request';
import { UpdateUserCommand } from 'src/user/application/commands/update-user.command';

@Controller('users')
export class UserController {
  constructor(private readonly userRepository: TypeOrmUserRepository) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({
    type: CreateUserRequest,
    examples: {
      example1: {
        summary: 'Usuario básico',
        description: 'Ejemplo de creación de un usuario con datos básicos',
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
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({
    type: UpdateUserRequest,
    examples: {
      example1: {
        summary: 'Actualizar todos los campos',
        description: 'Ejemplo de actualización completa de un usuario',
        value: {
          email: 'maria.lopez@ejemplo.com',
          firstName: 'María',
          lastName: 'López',
          phoneNumber: '+43 54323454',
          bio: 'Descripción del usuario',
          profileImageUrl: 'http://tuimagen.com',
          website: 'www.misitoweb.com',
          location: 'Madrid, España',
        },
      },
      example2: {
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
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
  })
  async getUsers(
    @Query() params: UserPaginationRequest,
  ): Promise<UserResponse[]> {
    const getAllUsersQuery = new GetAllUsersQuery(this.userRepository);
    const paginationResponse = await getAllUsersQuery.execute(params);
    return paginationResponse.items;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: String })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findById(@Param('id') id: string): Promise<UserResponse> {
    const query = new GetUserByIdQuery(this.userRepository);
    return query.execute({ id });
  }
}
