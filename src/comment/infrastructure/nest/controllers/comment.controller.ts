import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TypeOrmProjectRepository } from 'src/project/infrastructure/typeorm/repository/project';
import { TypeOrmCommentRepository } from '../../typeorm/repository/comment';
import { AddCommentRequest } from 'src/comment/application/commands/requests/add-comment.request';
import { AddCommentCommand } from 'src/comment/application/commands/add-comment-command';
import { JwtAuthGuard } from 'src/authentication/infrastructure/nest/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/user/infrastructure/nest/controllers/user.controller';
import { DeleteCommentCommand } from 'src/comment/application/commands/delete-comment-command';
import { DeleteCommentResponse } from 'src/comment/application/commands/responses/delete-comment.response';

@ApiTags('Comments')
@Controller('comments')
@ApiBearerAuth('JWT-auth')
export class CommentController {
  constructor(
    private readonly commentRepository: TypeOrmCommentRepository,
    private readonly projectRepository: TypeOrmProjectRepository,
  ) {}

  @Post(':projectId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Añade un comentario al proyecto',
    description:
      'Añade un comentario a un proyecto relacionando el proyecto con el usuario.',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Id único del proyecto',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de comentarios actuales',
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
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
    @Body() body: AddCommentRequest,
  ): Promise<number> {
    const command = new AddCommentCommand(
      this.commentRepository,
      this.projectRepository,
    );
    const userId = req.user.id;
    const totalComments = await command.execute({
      projectId,
      userId,
      request: { ...body },
    });
    return totalComments;
  }

  @Delete(':commentId')
  @ApiOperation({
    summary: 'Elimina un comentario del proyecto',
    description: 'Elimina un comentario de un proyecto.',
  })
  @ApiParam({
    name: 'commentid',
    description: 'Id único del comentario',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de la operación de eliminación',
    type: Boolean,
  })
  async removeComment(
    @Param('commentid') commentId: string,
  ): Promise<DeleteCommentResponse> {
    const command = new DeleteCommentCommand(this.commentRepository);
    return command.execute({ commentId });
  }
}
