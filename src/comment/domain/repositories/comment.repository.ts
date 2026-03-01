export interface CommentRepository {
  addComment(userId: string, projectId: string, text: string): Promise<void>;
  removeComment(commentId: string): Promise<void>;
  countComments(projectId: string): Promise<number>;
}
