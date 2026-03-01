import { Body, Controller, Param, Post } from '@nestjs/common';
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
import { AddCommentCommand } from 'src/comment/application/commands/responses/add-comment-command';

@ApiTags('Comments')
@Controller('comment')
@ApiBearerAuth('JWT-auth')
export class CommentController {
  constructor(
    private readonly commentRepository: TypeOrmCommentRepository,
    private readonly projectRepository: TypeOrmProjectRepository,
  ) {}

  @Post(':projectid')
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
    @Param('projectid') projectId: string,
    @Param('userid') userId: string,
    @Body() body: AddCommentRequest,
  ): Promise<{ comments: number }> {
    const command = new AddCommentCommand(
      this.commentRepository,
      this.projectRepository,
    );
    const totalComments = await command.execute({
      projectId,
      userId,
      request: { ...body },
    });
    return { comments: totalComments };
  }
}
