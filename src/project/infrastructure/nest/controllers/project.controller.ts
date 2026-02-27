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
import { TypeOrmProjectRepository } from '../../typeorm/repository/project';
import { CreateProjectRequest } from 'src/project/application/commands/requests/create-project.request';
import { ProjectCreator } from 'src/project/domain/services/project-create';
import { CreateProjectCommand } from 'src/project/application/commands/create-project-command';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TypeOrmUserRepository } from 'src/user/infrastructure/typeorm/repository/user';
import { UpdateProject } from 'src/project/domain/services/project-update';
import { UpdateProjectCommand } from 'src/project/application/commands/update-project-command';
import { UpdateProjectRequest } from 'src/project/application/commands/requests/update-project.request';
import { ProjectResponse } from 'src/project/application/queries/responses/project.response';
import { ProjectPaginationRequest } from 'src/project/application/queries/requests/project-pagination.request';
import { GetAllProjectsQuery } from 'src/project/application/queries/get-all-projects.query';
import { GetProjectByIdQuery } from 'src/project/application/queries/get-project-by-id.query';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { AddLikeCommand } from 'src/project/application/commands/add-like-command';
import { AddCommentCommand } from 'src/project/application/commands/add-comment-command';
import { AddCommentRequest } from 'src/project/application/commands/requests/add-comment.request';
import { GetProjectByUserIdQuery } from 'src/project/application/queries/get-project-by-user-id.query';
import { JwtAuthGuard } from 'src/authentication/infrastructure/nest/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/user/infrastructure/nest/controllers/user.controller';
import {
  GetProjectFeedQuery,
  GetProjectFeedResponse,
} from 'src/project/application/queries/get-feed-project.query';
import { GetProjectFeedRequest } from 'src/project/application/queries/requests/project-feed.request';

@ApiTags('Projects')
@Controller('projects')
@ApiBearerAuth('JWT-auth')
export class ProjectController {
  constructor(
    private readonly projectRepository: TypeOrmProjectRepository,
    private readonly userRepository: TypeOrmUserRepository,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo proyecto',
    description:
      'Permite registrar un nuevo proyecto en el sistema con sus datos básicos.',
  })
  @ApiBody({
    type: CreateProjectRequest,
    examples: {
      ejemplo1: {
        summary: 'Proyecto básico',
        description:
          'Ejemplo de creación de un proyecto con título y usuario asociado',
        value: {
          title: 'Diseño futuro',
          description: 'Un diseño elegante con toques futuristas',
          userId: '22d468e9-f816-40ae-9d86-b95a75edc524',
        },
      },
      ejemplo2: {
        summary: 'Proyecto sin descripción',
        description:
          'Ejemplo de creación de un proyecto solo con título y usuario',
        value: {
          title: 'Casa minimalista',
          userId: 'a3f5d9c2-7b8e-4d1a-9c3b-1f2e5d6a7b8c',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Proyecto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() body: CreateProjectRequest) {
    const creator = new ProjectCreator(
      this.projectRepository,
      this.userRepository,
    );
    const command = new CreateProjectCommand(creator);

    return await command.execute(body);
  }

  @Get('feed')
  async getFeed(
    @Query() params: GetProjectFeedRequest,
  ): Promise<GetProjectFeedResponse> {
    const query = new GetProjectFeedQuery(this.projectRepository);
    return await query.execute(params);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un proyecto',
    description:
      'Permite modificar los datos de un proyecto existente. Se pueden actualizar todos o algunos campos.',
  })
  @ApiParam({ name: 'id', description: 'ID único del proyecto', type: String })
  @ApiBody({
    type: UpdateProjectRequest,
    examples: {
      ejemplo1: {
        summary: 'Actualizar todos los campos',
        description: 'Ejemplo de actualización completa de un proyecto',
        value: {
          title: 'Centro Cultural Habana',
          description:
            'Renovación integral de un edificio histórico para convertirlo en centro cultural con salas de exposición, biblioteca y auditorio.',
        },
      },
      ejemplo2: {
        summary: 'Actualizar título',
        description: 'Ejemplo de actualización parcial de un proyecto',
        value: { title: 'Residencia Moderna en Miramar' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Proyecto actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  async update(@Param('id') id: string, @Body() body: UpdateProjectRequest) {
    const updateProjectService = new UpdateProject(this.projectRepository);
    const command = new UpdateProjectCommand(
      this.projectRepository,
      updateProjectService,
    );
    return command.execute({ request: { ...body }, projectId: id });
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los proyectos',
    description:
      'Devuelve una lista paginada de todos los proyectos registrados en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de proyectos obtenida exitosamente',
    type: [ProjectResponse],
  })
  async getProjects(
    @Query() params: ProjectPaginationRequest,
  ): Promise<PaginationResponse<ProjectResponse>> {
    const query = new GetAllProjectsQuery(this.projectRepository);
    const paginationResponse = await query.execute(params);
    return paginationResponse;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener proyectos del usuario autenticado',
    description:
      'Devuelve la lista de proyectos asociados al usuario autenticado, filtrando los proyectos activos. Requiere un token JWT válido.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de proyectos del usuario obtenida exitosamente',
    type: [ProjectResponse],
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o no proporcionado',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron proyectos para el usuario autenticado',
  })
  async getMyProjects(@Req() req: RequestWithUser): Promise<ProjectResponse[]> {
    const query = new GetProjectByUserIdQuery(this.projectRepository);
    return await query.execute({ id: req.user.id });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un proyecto por Id',
    description:
      'Devuelve la información de un proyecto específico a partir de su identificador único.',
  })
  @ApiParam({ name: 'id', description: 'Id único del proyecto', type: String })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: ProjectResponse,
  })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  async findById(@Param('id') id: string): Promise<ProjectResponse> {
    const query = new GetProjectByIdQuery(this.projectRepository);
    return query.execute({ id });
  }

  @Post(':projectId/likes/:userId')
  @ApiOperation({
    summary: 'Añade un like al proyecto',
    description:
      'Añade un like a un proyecto relacionando el proyecto con el usuario.',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Id único del proyecto',
    type: String,
  })
  @ApiParam({
    name: 'userId',
    description: 'Id único del usuario',
    type: String,
  })
  @ApiResponse({
    description: 'Cantidad de likes actuales',
    schema: {
      type: 'object',
      properties: { likes: { type: 'number', example: 42 } },
    },
  })
  async addLike(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ): Promise<{ likes: number }> {
    const command = new AddLikeCommand(this.projectRepository);
    const totalLikes = await command.execute({ projectId, userId });
    return { likes: totalLikes };
  }

  @Post(':projectid/comment/:userid')
  @ApiOperation({
    summary: 'Añade un comentario al proyecto',
    description:
      'Añade un comentario a un proyecto relacionando el proyecto con el usuario.',
  })
  @ApiParam({
    name: 'projectid',
    description: 'Id único del proyecto',
    type: String,
  })
  @ApiParam({
    name: 'userid',
    description: 'Id único del usuario',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de likes actuales',
    type: Number,
  })
  @ApiBody({
    type: AddCommentRequest,

    examples: {
      ejemplo: {
        summary: 'Texto del comentario',
        value: {
          message: 'Excelente proyecto',
        },
      },
    },
  })
  async addComment(
    @Param('projectid') projectId: string,
    @Param('userid') userId: string,
    @Body() body: AddCommentRequest,
  ): Promise<{ comments: number }> {
    const command = new AddCommentCommand(this.projectRepository);
    const totalComments = await command.execute({
      projectId,
      userId,
      request: { ...body },
    });
    return { comments: totalComments };
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'Obtener proyectos por usuario',
    description:
      'Devuelve la lista de proyectos asociados a un usuario específico, filtrando los proyectos activos.',
  })
  @ApiParam({
    name: 'id',
    description: 'Id único del usuario',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de proyectos del usuario obtenida exitosamente',
    type: [ProjectResponse],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron proyectos para el usuario',
  })
  async getByUserId(@Param('id') id: string): Promise<ProjectResponse[]> {
    const query = new GetProjectByUserIdQuery(this.projectRepository);
    return await query.execute({ id });
  }
}
