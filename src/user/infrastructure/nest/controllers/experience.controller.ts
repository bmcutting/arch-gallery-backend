import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/authentication/infrastructure/nest/decorators/auth.decorator';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { UlidGenerator } from 'src/shared/infrastructure/services/ulid.generator';
import { ExperienceCreateCommand } from 'src/user/application/commands/experience/experience-create.command';
import { ExperienceCreateRequest } from 'src/user/application/commands/experience/requests/experience-create.request';
import { ExperienceUpdateCommand } from 'src/user/application/commands/experience/experience-update.command';
import { ExperienceUpdateRequest } from 'src/user/application/commands/experience/requests/experience-update.request';
import { ExperienceGetMineQuery } from 'src/user/application/queries/experience/experience-get-mine.query';
import { ExperienceGetMineRequest } from 'src/user/application/queries/experience/requests/experience-get-mine.request';
import { ExperienceResponse } from 'src/user/application/queries/experience/responses/experience.response';
import { ExperienceCreate } from 'src/user/domain/services/experience/experience-create';
import { UpdateExperience } from 'src/user/domain/services/experience/experience-update';
import { TypeOrmExperienceRepository } from '../../typeorm/repositories/experience.repository';
import { TypeOrmUserRepository } from '../../typeorm/repositories/user.repository';
import type { RequestWithUser } from './user.controller';

@ApiTags('Experiences')
@Controller('experiences')
@Auth()
export class ExperienceController {
  constructor(
    private readonly userRepository: TypeOrmUserRepository,
    private readonly experienceRepository: TypeOrmExperienceRepository,
    private readonly ids: UlidGenerator,
  ) {}

  @Get('me')
  @ApiOperation({
    summary: 'Listar las experiencias del usuario autenticado',
    description:
      'Se puede filtrar por tipo y ordenar por año, título o institución.',
  })
  @ApiResponse({ status: 200, description: 'Experiencias paginadas' })
  async getMine(
    @Req() req: RequestWithUser,
    @Query() params: ExperienceGetMineRequest,
  ): Promise<PaginationResponse<ExperienceResponse>> {
    const query = new ExperienceGetMineQuery(this.experienceRepository);

    return await query.execute({
      request: params,
      currentUserId: req.user.id,
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una experiencia para el usuario autenticado',
  })
  @ApiBody({ type: ExperienceCreateRequest })
  @ApiResponse({
    status: 201,
    description: 'Experiencia creada',
    type: ExperienceResponse,
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() body: ExperienceCreateRequest,
  ): Promise<ExperienceResponse> {
    const service = new ExperienceCreate(
      this.userRepository,
      this.experienceRepository,
      this.ids,
    );
    const command = new ExperienceCreateCommand(service);

    return await command.execute({
      request: body,
      currentUserId: req.user.id,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar una experiencia propia' })
  @ApiBody({ type: ExperienceUpdateRequest })
  @ApiResponse({
    status: 200,
    description: 'Experiencia actualizada',
    type: ExperienceResponse,
  })
  @ApiResponse({ status: 403, description: 'not-resource-owner' })
  @ApiResponse({ status: 404, description: 'experience-not-found' })
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: ExperienceUpdateRequest,
  ): Promise<ExperienceResponse> {
    const service = new UpdateExperience(this.experienceRepository);
    const command = new ExperienceUpdateCommand(
      this.experienceRepository,
      service,
    );

    return await command.execute({
      request: body,
      id,
      currentUserId: req.user.id,
    });
  }
}
