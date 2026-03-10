import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { JwtAuthGuard } from 'src/authentication/infrastructure/nest/guards/jwt-auth.guard';
import { DeleteLikeCommand } from 'src/like/application/commands/delete-like-command';

@ApiTags('Likes')
@Controller('likes')
@ApiBearerAuth('JWT-auth')
export class LikeController {
  constructor(private readonly likeRepository: TypeOrmLikeRepository) {}

  @Post(':projectId')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
