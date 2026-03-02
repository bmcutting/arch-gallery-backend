import { TypeOrmProjectRepository } from 'src/project/infrastructure/typeorm/repository/project';
import { TypeOrmCategoryRepository } from '../../typeorm/repository/category';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateCategoryRequest } from 'src/category/application/commands/requests/create-category.request';
import { CategoryCreator } from 'src/category/domain/services/category-create';
import { CreateCategoryCommand } from 'src/category/application/commands/create-category-command';
import { UpdateCategoryRequest } from 'src/category/application/commands/requests/update-category.request';
import { UpdateCategory } from 'src/category/domain/services/category-update';
import { UpdateCategoryCommand } from 'src/category/application/commands/update-category-command';
import { CategoryResponse } from 'src/category/application/queries/responses/category.response';
import { CategoryPaginationRequest } from 'src/category/application/queries/requests/category-pagination.request';
import { GetAllCategoriesQuery } from 'src/category/application/queries/get-all-categories.query';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { GetCategoryByIdQuery } from 'src/category/application/queries/get-category-by-id.query';

@ApiTags('Categories')
@Controller('categories')
@ApiBearerAuth('JWT-auth')
export class CategoryController {
  constructor(
    private readonly projectRepository: TypeOrmProjectRepository,
    private readonly categoryRepository: TypeOrmCategoryRepository,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva categoría asociada a un proyecto',
    description:
      'Permite registrar una nueva categoría en el sistema asociándola a un proyecto.',
  })
  @ApiBody({
    type: CreateCategoryRequest,
    examples: {
      ejemplo: {
        summary: 'Categoría nueva',
        description: 'Ejemplo de creación de una categoría',
        value: {
          name: 'Urbanismo',
          projectId: '28582f21-2435-4a2e-9a4b-b002bc5cb0d6',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() body: CreateCategoryRequest) {
    const creator = new CategoryCreator(
      this.categoryRepository,
      this.projectRepository,
    );

    const command = new CreateCategoryCommand(creator);

    return await command.execute(body);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una categoría',
    description: 'Permite modificar el nombre de una categoría existente.',
  })
  @ApiBody({
    type: UpdateCategoryRequest,
    examples: {
      ejemplo: {
        summary: 'Actualizar el nombre',
        description: 'Ejemplo de actualización',
        value: {
          name: 'Urbanismo',
        },
      },
    },
  })
  async update(@Param('id') id: string, @Body() body: UpdateCategoryRequest) {
    const updateCategoryService = new UpdateCategory(this.categoryRepository);
    const command = new UpdateCategoryCommand(
      this.categoryRepository,
      updateCategoryService,
    );
    return command.execute({ request: { ...body, categoryId: id } });
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las categorías',
    description:
      'Devuelve una lista paginada de todas las categorías registradas en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida exitosamente',
    type: [PaginationResponse<CategoryResponse>],
  })
  async getCategories(
    @Query() params: CategoryPaginationRequest,
  ): Promise<PaginationResponse<CategoryResponse>> {
    const query = new GetAllCategoriesQuery(this.categoryRepository);
    const paginationResponse = await query.execute(params);
    return paginationResponse;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una categoría por Id',
    description:
      'Devuelve la información de una categoría específica a partir de su identificador único.',
  })
  @ApiParam({
    name: 'id',
    description: 'Id único de la categoría',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: CategoryResponse,
  })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async findById(@Param('id') id: string): Promise<CategoryResponse> {
    const query = new GetCategoryByIdQuery(this.categoryRepository);
    return query.execute({ id });
  }
}
