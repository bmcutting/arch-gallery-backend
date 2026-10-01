import { Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddLikeCommand } from 'src/like/application/commands/add-like-command';
import type { RequestWithUser } from 'src/user/infrastructure/nest/controllers/user.controller';
import { TypeOrmLikeRepository } from '../../typeorm/repository/like';
import { Auth } from 'src/authentication/infrastructure/nest/decorators/auth.decorator';
import { DeleteLikeCommand } from 'src/like/application/commands/delete-like-command';

@ApiTags('Likes')
@Controller('likes')
@Auth()
export class LikeController {
  constructor(private readonly likeRepository: TypeOrmLikeRepository) {}

  @Post(':projectId')
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
  @ApiResponse({
    description: 'Cantidad de likes actuales',
    schema: {
      type: 'object',
      properties: { likes: { type: 'number', example: 42 } },
    },
  })
  async addLike(
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ): Promise<number> {
    const command = new AddLikeCommand(this.likeRepository);
    const userId = req.user.id;
    const totalLikes = await command.execute({ projectId, userId });
    return totalLikes;
  }

  @Delete(':projectId')
  @ApiOperation({
    summary: 'Elimina un like del proyecto',
    description: 'Elimina un like de un proyecto.',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Id único del proyecto',
    type: String,
  })
  @ApiResponse({
    description: 'Cantidad de likes actuales',
    schema: {
      type: 'object',
      properties: { likes: { type: 'number', example: 42 } },
    },
  })
  async removeLike(
    @Param('projectId') id: string,
    @Req() req: RequestWithUser,
  ): Promise<number> {
    const command = new DeleteLikeCommand(this.likeRepository);
    const totalLikes = await command.execute({
      projectId: id,
      userId: req.user.id,
    });
    return totalLikes;
  }
}
