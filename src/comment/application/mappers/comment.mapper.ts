import { Comment } from 'src/comment/domain/entities/comment.entity';
import { CommentResponse } from '../queries/responses/comment.response';

export class CommentResponseMapper {
  static toResponse(comment: Comment): CommentResponse {
    return {
      id: comment.id,
      userId: comment.userId,
      projectId: comment.projectId,
      message: comment.message,
      user: {
        id: comment.user.id,
        userName: comment.user.userName,
        profileImageUrl: comment.user.profileImageUrl,
      },
    };
  }

  static toResponseList(comments: Comment[]): CommentResponse[] {
    return comments.map((comment) => this.toResponse(comment));
  }
}
