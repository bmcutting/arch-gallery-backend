import { InjectRepository } from '@nestjs/typeorm';
import { LikeRepository } from 'src/like/domain/repositories/like.repository';
import { LikeModel } from '../models/like';
import { Repository } from 'typeorm';
import { NotFoundLikeException, RepeatLikeException } from 'src/like/domain/exceptions/like';

export class TypeOrmLikeRepository implements LikeRepository {
  constructor(
    @InjectRepository(LikeModel)
    private readonly likeRepository: Repository<LikeModel>,
  ) {}

  async addLike(userId: string, projectId: string): Promise<void> {
    const existing = await this.likeRepository.findOne({
      where: { userId, projectId },
    });
    if (existing) {
      throw new RepeatLikeException();
    }
    const like = this.likeRepository.create({ userId, projectId });
    await this.likeRepository.save(like);
  }

  async removeLike(userId: string, projectId: string): Promise<void> {
    const existing = await this.likeRepository.findOne({
      where: { userId, projectId },
    });
    if (!existing) {
      throw new NotFoundLikeException();
    }
    await this.likeRepository.delete({ userId, projectId });
  }

  async countLikes(projectId: string): Promise<number> {
    const likes = await this.likeRepository.count({
      where: { project: { id: projectId } },
    });
    return likes;
  }
}
