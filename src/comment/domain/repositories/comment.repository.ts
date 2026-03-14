import { Comment } from '../entities/comment.entity';

export interface CommentRepository {
  addComment(userId: string, projectId: string, text: string): Promise<void>;
  findById(commentId: string): Promise<Comment | null>;
  removeComment(commentId: string);
  countComments(projectId: string): Promise<number>;
  findByProjectId(projectId: string): Promise<Comment[]>;
}
