import { CommentRepository } from 'src/comment/domain/repositories/comment.repository';
import { CommentResponse } from './responses/comment.response';
import { GetCommentsByProjectIdRequest } from './requests/comment-get-by-project-id.request';
import { Query } from 'src/shared/interfaces/queries.interface';
import { CommentResponseMapper } from '../mappers/comment.mapper';

export class GetCommentsByProjectIdQuery implements Query<
  GetCommentsByProjectIdRequest,
  Promise<CommentResponse[]>
> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(
    request: GetCommentsByProjectIdRequest,
  ): Promise<CommentResponse[]> {
    const comments = await this.commentRepository.findByProjectId(
      request.projectId,
    );
    return CommentResponseMapper.toResponseList(comments);
  }
}
