import { UlidGenerator } from 'src/shared/infrastructure/services/ulid.generator';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeRepository } from 'src/like/domain/repositories/like.repository';
import { LikeModel } from '../models/like.model';
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
    private readonly ids: UlidGenerator,
  ) {}

  async addLike(userId: string, projectId: string): Promise<void> {
    const existing = await this.likeRepository.findOne({
      where: { user_id: userId, project_id: projectId },
    });
    if (existing) {
      throw new RepeatLikeException();
    }
    const like = this.likeRepository.create({
      id: this.ids.create(),
      user_id: userId,
      project_id: projectId,
    });
    await this.likeRepository.save(like);
  }

  async removeLike(projectId: string, userId: string): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { user_id: userId, project_id: projectId },
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
      where: { id, isActive: true },
    });

    return found ? LikeTypeOrmMapper.execute(found) : null;
  }
}
