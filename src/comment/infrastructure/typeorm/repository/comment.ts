import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from 'src/comment/domain/repositories/comment.repository';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { Repository } from 'typeorm';
import { CommentModel } from '../models/comment';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { CommentTypeOrmMapper } from '../mappers/comment.mapper';
import { Comment } from 'src/comment/domain/entities/comment.entity';

export class TypeOrmCommentRepository implements CommentRepository {
  constructor(
    @InjectRepository(CommentModel)
    private readonly commentRepository: Repository<CommentModel>,
  ) {}

  async addComment(
    userId: string,
    projectId: string,
    text: string,
  ): Promise<void> {
    const comment = new CommentModel();
    comment.project = { id: projectId } as ProjectModel;
    comment.user = { id: userId } as UserModel;
    comment.message = text;

    await this.commentRepository.save(comment);
  }

  async removeComment(commentId: string) {
    await this.commentRepository.delete(commentId);
  }

  async countComments(projectId: string): Promise<number> {
    const comments = await this.commentRepository.count({
      where: { project: { id: projectId } },
    });
    return comments;
  }

  async findById(id: string): Promise<Comment | null> {
    const found = await this.commentRepository.findOne({
      where: { id },
    });

    return found ? CommentTypeOrmMapper.execute(found) : null;
  }

  async findByProjectId(projectId: string): Promise<Comment[]> {
    const found = await this.commentRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });

    return found.map((entity) => CommentTypeOrmMapper.execute(entity));
  }
}
