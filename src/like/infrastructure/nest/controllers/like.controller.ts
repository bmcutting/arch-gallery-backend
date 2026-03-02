import { Controller, Param, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddLikeCommand } from 'src/like/application/commands/add-like-command';
import type { RequestWithUser } from 'src/user/infrastructure/nest/controllers/user.controller';
import { TypeOrmLikeRepository } from '../../typeorm/repository/like';

@ApiTags('Likes')
@Controller('likes')
@ApiBearerAuth('JWT-auth')
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
  ): Promise<{ likes: number }> {
    const command = new AddLikeCommand(this.likeRepository);
    const userId = req.user.id;
    const totalLikes = await command.execute({ projectId, userId });
    return { likes: totalLikes };
  }
}
