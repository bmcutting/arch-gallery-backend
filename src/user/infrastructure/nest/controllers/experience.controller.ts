import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TypeOrmUserRepository } from '../../typeorm/repository/user';
import { JwtAuthGuard } from 'src/authentication/infrastructure/nest/guards/jwt-auth.guard';
import { CreateExperienceRequest } from 'src/user/application/commands/requests/create-experience.request';
import { User } from 'src/user/domain/entities/user.entity';
import { CreateExperienceResponse } from 'src/user/application/commands/responses/create-experience.response';
import { ExperienceCreator } from 'src/user/domain/services/experience-create';
import { CreateExperienceCommand } from 'src/user/application/commands/create-experience.command';
import { TypeOrmExperienceRepository } from '../../typeorm/repository/experience';
import { UpdateExperienceRequest } from 'src/user/application/commands/requests/update-experience.request';
import { UpdateExperience } from 'src/user/domain/services/experience-update';
import { UpdateExperienceCommand } from 'src/user/application/commands/update-experience.command';

@ApiTags('Experiences')
@Controller('experiences')
@ApiBearerAuth('JWT-auth')
export class ExperienceController {
  constructor(
    private readonly userRepository: TypeOrmUserRepository,
    private readonly experienceRepository: TypeOrmExperienceRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Crear una nueva experience asociada a un usuario',
    description:
      'Permite registrar una nueva experience en el sistema asociándola a un usuario.',
  })
  @ApiBody({
    type: CreateExperienceRequest,
    examples: {
      ejemplo: {
        summary: 'Experience nueva',
        description: 'Ejemplo de creación de una experience',
        value: {
          title: 'Máster en Urbanismo',
          userId: '28582f21-2435-4a2e-9a4b-b002bc5cb0d6',
          institutionOrCompany: 'Universidad Politécnica de Madrid',
          description: 'Programa de posgrado en urbanismo sostenible',
          startYear: 2020,
          isCurrent: false,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Experiencia creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(
    @Req() req: { user: User },
    @Body() body: CreateExperienceRequest,
  ): Promise<CreateExperienceResponse> {
    const creator = new ExperienceCreator(
      this.userRepository,
      this.experienceRepository,
    );
    const command = new CreateExperienceCommand(creator);

    return await command.execute({
      ...body,
      userId: req.user.id,
    });
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una experience',
    description: 'Permite modificar el nombre de una experience existente.',
  })
  @ApiBody({
    type: UpdateExperienceRequest,
    examples: {
      ejemplo: {
        summary: 'Actualizar el nombre',
        description: 'Ejemplo de actualización',
        value: {
          title: 'Máster en Urbanismo',
          userId: '28582f21-2435-4a2e-9a4b-b002bc5cb0d6',
          institutionOrCompany: 'Universidad Politécnica de Madrid',
          description: 'Programa de posgrado en urbanismo sostenible',
          startYear: 2020,
          isCurrent: false,
        },
      },
    },
  })
  async update(@Param('id') id: string, @Body() body: UpdateExperienceRequest) {
    const updateExperienceService = new UpdateExperience(
      this.experienceRepository,
    );
    const command = new UpdateExperienceCommand(
      this.experienceRepository,
      updateExperienceService,
    );
    return command.execute({ request: { ...body, experienceId: id } });
  }
}
