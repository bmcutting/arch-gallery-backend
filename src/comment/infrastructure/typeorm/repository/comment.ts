import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from 'src/comment/domain/repositories/comment.repository';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { Repository } from 'typeorm';
import { CommentModel } from '../models/comment';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';

export class TypeOrmCommentRepository implements CommentRepository {
  constructor(
    @InjectRepository(ProjectModel)
    private readonly projectRepository: Repository<ProjectModel>,
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

  async removeComment(commentId: string): Promise<void> {
    await this.commentRepository.delete(commentId);
  }

  async countComments(projectId: string): Promise<number> {
    const comments = await this.commentRepository.count({
      where: { project: { id: projectId } },
    });
    return comments;
  }
}
