import { Like } from '../entities/like.entity';

export interface LikeRepository {
  addLike(userId: string, projectId: string): Promise<void>;
  removeLike(likeId: string): Promise<void>;
  countLikes(projectId: string): Promise<number>;
  findById(id: string): Promise<Like | null>;
}
