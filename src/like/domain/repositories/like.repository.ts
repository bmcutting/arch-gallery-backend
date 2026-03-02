export interface LikeRepository {
  addLike(userId: string, projectId: string): Promise<void>;
  removeLike(userId: string, projectId: string): Promise<void>;
  countLikes(projectId: string): Promise<number>;
}
