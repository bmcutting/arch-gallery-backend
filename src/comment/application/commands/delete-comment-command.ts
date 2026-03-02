import { Command } from 'src/shared/interfaces/command.interface';
import { DeleteCommentResponse } from './responses/delete-comment.response';
import { DeleteCommentRequest } from './requests/delete-comment.request';
import { CommentRepository } from 'src/comment/domain/repositories/comment.repository';
import { NotFoundCommentException } from 'src/comment/domain/exceptions/comment';

export class DeleteCommentCommand implements Command<
  DeleteCommentRequest,
  DeleteCommentResponse
> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(props: DeleteCommentRequest): Promise<DeleteCommentResponse> {
    const comment = await this.commentRepository.findById(props.commentId);
    if (!comment) {
      throw new NotFoundCommentException();
    }

    await this.commentRepository.removeComment(props.commentId);

    return { success: true };
  }
}
