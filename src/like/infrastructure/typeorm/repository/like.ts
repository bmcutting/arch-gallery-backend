import { InjectRepository } from '@nestjs/typeorm';
import { LikeRepository } from 'src/like/domain/repositories/like.repository';
import { LikeModel } from '../models/like';
import { Repository } from 'typeorm';

export class TypeOrmLikeRepository implements LikeRepository {
  constructor(
    @InjectRepository(LikeModel)
    private readonly likeRepository: Repository<LikeModel>,
  ) {}

  async addLike(userId: string, projectId: string): Promise<void> {
    const like = new LikeModel();
    like.userId = userId;
    like.projectId = projectId;

    await this.likeRepository.save(like);
  }

  async removeLike(userId: string, projectId: string): Promise<void> {
    await this.likeRepository.delete({ userId, projectId });
  }

  async countLikes(projectId: string): Promise<number> {
    const likes = await this.likeRepository.count({
      where: { project: { id: projectId } },
    });
    return likes;
  }
}
