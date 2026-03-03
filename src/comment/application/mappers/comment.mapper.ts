import { Comment } from 'src/comment/domain/entities/comment.entity';
import { CommentResponse } from '../queries/responses/comment.response';

export class CommentResponseMapper {
  static toReponse(comment: Comment): CommentResponse {
    return {
      id: comment.id,
      userId: comment.userId,
      projectId: comment.projectId,
      message: comment.message,
    };
  }

  static toResponseList(comments: Comment[]): CommentResponse[] {
    return comments.map((comment) => this.toReponse(comment));
  }
}
