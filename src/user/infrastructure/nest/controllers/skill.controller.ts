import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateSkillRequest } from 'src/user/application/commands/requests/create-skill.request';
import { SkillCreator } from 'src/user/domain/services/skill-create';
import { TypeOrmSkillRepository } from '../../typeorm/repository/skill';
import { TypeOrmUserRepository } from '../../typeorm/repository/user';
import { JwtAuthGuard } from 'src/authentication/infrastructure/nest/guards/jwt-auth.guard';
import { CreateSkillCommand } from 'src/user/application/commands/create-skill.command';
import { User } from 'src/user/domain/entities/user.entity';
import { SkillResponse } from 'src/user/application/queries/responses/skill.response';
import { UpdateSkillRequest } from 'src/user/application/commands/requests/update-skill.request';
import { UpdateSkill } from 'src/user/domain/services/skill-update';
import { UpdateSkillCommand } from 'src/user/application/commands/update-skill.command';
import { SearchSkillsQuery } from 'src/user/application/queries/search-skills.query';
import { CreateSkillResponse } from 'src/user/application/commands/responses/create-skill.response';

@ApiTags('Skills')
@Controller('skills')
@ApiBearerAuth('JWT-auth')
export class SkillController {
  constructor(
    private readonly userRepository: TypeOrmUserRepository,
    private readonly skillRepository: TypeOrmSkillRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Crear una nueva skill asociada a un usuario',
    description:
      'Permite registrar una nueva skill en el sistema asociándola a un usuario.',
  })
  @ApiBody({
    type: CreateSkillRequest,
    examples: {
      ejemplo: {
        summary: 'Skill nueva',
        description: 'Ejemplo de creación de una skill',
        value: {
          name: 'Modelado 3D',
          userId: '28582f21-2435-4a2e-9a4b-b002bc5cb0d6',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Skill creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(
    @Req() req: { user: User },
    @Body() body: CreateSkillRequest,
  ): Promise<CreateSkillResponse> {
    const creator = new SkillCreator(this.userRepository, this.skillRepository);
    const command = new CreateSkillCommand(creator);

    return await command.execute({
      ...body,
      userId: req.user.id,
    });
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar skills por nombre',
    description:
      'Devuelve una lista de skills que coinciden parcial o totalmente con el texto ingresado.',
  })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Texto a buscar dentro del nombre de las skills',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de skills coincidentes',
    type: [SkillResponse],
  })
  async searchSkills(
    @Query('name') name: string,
  ): Promise<SkillResponse[] | null> {
    const searchQuery = new SearchSkillsQuery(this.skillRepository);
    return await searchQuery.execute({ name });
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una skill',
    description: 'Permite modificar el nombre de una skill existente.',
  })
  @ApiBody({
    type: UpdateSkillRequest,
    examples: {
      ejemplo: {
        summary: 'Actualizar el nombre',
        description: 'Ejemplo de actualización',
        value: {
          name: 'Renderizado avanzado',
        },
      },
    },
  })
  async update(@Param('id') id: string, @Body() body: UpdateSkillRequest) {
    const updateSkillService = new UpdateSkill(this.skillRepository);
    const command = new UpdateSkillCommand(
      this.skillRepository,
      updateSkillService,
    );
    return command.execute({ request: { ...body, skillId: id } });
  }
}
