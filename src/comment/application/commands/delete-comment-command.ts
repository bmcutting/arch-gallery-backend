import { Command } from 'src/shared/application/interfaces/command.interface';
import { DeleteCommentResponse } from './responses/delete-comment.response';
import { DeleteCommentRequest } from './requests/delete-comment.request';
import { CommentRepository } from 'src/comment/domain/repositories/comment.repository';
import { NotFoundCommentException } from 'src/comment/domain/exceptions/comment';
import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { ForbiddenException } from '@nestjs/common';

export class DeleteCommentCommand implements Command<
  DeleteCommentRequest,
  DeleteCommentResponse
> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(props: DeleteCommentRequest): Promise<DeleteCommentResponse> {
    const comment = await this.commentRepository.findById(props.commentId);
    if (!comment) {
      throw new NotFoundCommentException();
    }

    // Puede borrar el comentario su autor o el dueño del proyecto comentado.
    if (comment.getUserId() !== props.currentUserId) {
      const project = await this.projectRepository.findById(
        comment.getProjectId(),
      );
      if (!project || project.getUser().getId() !== props.currentUserId) {
        throw new ForbiddenException('No puedes eliminar este comentario');
      }
    }

    await this.commentRepository.removeComment(props.commentId);

    return { success: true };
  }
}
