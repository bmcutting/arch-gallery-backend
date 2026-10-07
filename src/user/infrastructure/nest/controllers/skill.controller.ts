import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/authentication/infrastructure/nest/decorators/auth.decorator';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { UlidGenerator } from 'src/shared/infrastructure/services/ulid.generator';
import { TypeOrmUnitOfWork } from 'src/shared/infrastructure/typeorm/services/typeorm-unit-of-work';
import { SimpleTextNormalizer } from 'src/shared/domain/services/simple-text.normalizer';
import { UserSkillUpdateCommand } from 'src/user/application/commands/skill/user-skill-update.command';
import { UserSkillUpdateRequest } from 'src/user/application/commands/skill/requests/user-skill-update.request';
import { SkillResponse } from 'src/user/application/queries/skill/responses/skill.response';
import { UserSkillResponse } from 'src/user/application/queries/skill/responses/user-skill.response';
import { SkillGetAllQuery } from 'src/user/application/queries/skill/skill-get-all.query';
import { SkillGetAllRequest } from 'src/user/application/queries/skill/requests/skill-get-all.request';
import { SkillFindById } from 'src/user/domain/services/skill/skill-find-by-id';
import { UserSkillGetMineQuery } from 'src/user/application/queries/skill/user-skill-get-mine.query';
import { UserSkillGetMineRequest } from 'src/user/application/queries/skill/requests/user-skill-get-mine.request';
import { SkillDeleteCommand } from 'src/user/application/commands/skill/skill-delete.command';
import { SkillFindOwn } from 'src/user/domain/services/skill/skill-find-own';
import { SkillResolve } from 'src/user/domain/services/skill/skill-resolve';
import { SkillDelete } from 'src/user/domain/services/skill/skill-delete';
import { UserSkillSync } from 'src/user/domain/services/user-skill/user-skill-sync';
import { TypeOrmSkillRepository } from '../../typeorm/repositories/skill.repository';
import { TypeOrmUserSkillRepository } from '../../typeorm/repositories/user-skill.repository';
import type { RequestWithUser } from './user.controller';

@ApiTags('Skills')
@Controller('skills')
@Auth()
export class SkillController {
  constructor(
    private readonly skillRepository: TypeOrmSkillRepository,
    private readonly userSkillRepository: TypeOrmUserSkillRepository,
    private readonly unitOfWork: TypeOrmUnitOfWork,
    private readonly ids: UlidGenerator,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar el catálogo de habilidades',
    description:
      'Devuelve las habilidades del catálogo global más las privadas del usuario autenticado.',
  })
  @ApiResponse({ status: 200, description: 'Catálogo paginado' })
  async getAll(
    @Req() req: RequestWithUser,
    @Query() params: SkillGetAllRequest,
  ): Promise<PaginationResponse<SkillResponse>> {
    const query = new SkillGetAllQuery(this.skillRepository);

    return await query.execute({
      request: params,
      currentUserId: req.user.id,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Borrar una habilidad propia del catálogo',
    description:
      'Solo habilidades privadas creadas por el usuario. Borra también las asociaciones con su perfil.',
  })
  @ApiResponse({ status: 200, description: 'Habilidad borrada' })
  @ApiResponse({
    status: 404,
    description: 'skill-not-found: no existe, o no es una habilidad propia',
  })
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<void> {
    const service = new SkillDelete(
      this.skillRepository,
      this.userSkillRepository,
      new SkillFindOwn(this.skillRepository),
    );
    const command = new SkillDeleteCommand(this.unitOfWork, service);

    return await command.execute({ id, currentUserId: req.user.id });
  }
}

@ApiTags('Users')
@Controller('users/me/skills')
@Auth()
export class UserSkillController {
  constructor(
    private readonly skillRepository: TypeOrmSkillRepository,
    private readonly userSkillRepository: TypeOrmUserSkillRepository,
    private readonly unitOfWork: TypeOrmUnitOfWork,
    private readonly ids: UlidGenerator,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar las habilidades del usuario autenticado',
    description:
      'Se puede filtrar por nombre, nivel y procedencia, y ordenar por nombre, nivel o fecha.',
  })
  @ApiResponse({ status: 200, description: 'Habilidades paginadas' })
  async getMine(
    @Req() req: RequestWithUser,
    @Query() params: UserSkillGetMineRequest,
  ): Promise<PaginationResponse<UserSkillResponse>> {
    const query = new UserSkillGetMineQuery(this.userSkillRepository);

    return await query.execute({
      request: params,
      currentUserId: req.user.id,
    });
  }

  @Patch()
  @ApiOperation({
    summary: 'Actualizar las habilidades del usuario autenticado',
    description:
      'Recibe el conjunto completo: lo que no venga se elimina. Cada elemento lleva `id` de una ' +
      'habilidad del catálogo o `name` para crearla; si llegan los dos gana el `id`.',
  })
  @ApiBody({ type: UserSkillUpdateRequest })
  @ApiResponse({ status: 200, description: 'Habilidades del perfil' })
  @ApiResponse({
    status: 400,
    description:
      'user-skill-duplicate: la misma habilidad llega dos veces. skill-name-invalid: nombre vacío.',
  })
  async update(
    @Req() req: RequestWithUser,
    @Body() body: UserSkillUpdateRequest,
  ): Promise<UserSkillResponse[]> {
    const normalizer = new SimpleTextNormalizer();
    const skillResolve = new SkillResolve(
      this.skillRepository,
      new SkillFindById(this.skillRepository),
      normalizer,
      this.ids,
    );
    const sync = new UserSkillSync(
      this.userSkillRepository,
      skillResolve,
      this.ids,
    );
    const command = new UserSkillUpdateCommand(this.unitOfWork, sync);

    return await command.execute({
      request: body,
      currentUserId: req.user.id,
    });
  }
}
