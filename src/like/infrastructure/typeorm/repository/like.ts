import { InjectRepository } from '@nestjs/typeorm';
import { LikeRepository } from 'src/like/domain/repositories/like.repository';
import { LikeModel } from '../models/like';
import { Repository } from 'typeorm';
import {
  NotFoundLikeException,
  RepeatLikeException,
} from 'src/like/domain/exceptions/like';
import { Like } from 'src/like/domain/entities/like.entity';
import { LikeTypeOrmMapper } from '../mappers/like.mapper';

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

  async removeLike(projectId: string, userId: string): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { userId, projectId },
    });

    if (!like) {
      throw new NotFoundLikeException();
    }

    await this.likeRepository.delete(like.id);
  }

  async countLikes(projectId: string): Promise<number> {
    const likes = await this.likeRepository.count({
      where: { project: { id: projectId } },
    });
    return likes;
  }

  async findById(id: string): Promise<Like | null> {
    const found = await this.likeRepository.findOne({
      where: { id },
    });

    return found ? LikeTypeOrmMapper.execute(found) : null;
  }
}
