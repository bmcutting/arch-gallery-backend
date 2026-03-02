import { Comment } from 'src/comment/domain/entities/comment.entity';
import { CommentModel } from '../models/comment';

export class CommentTypeOrmMapper {
  constructor() {}

  static execute(c: CommentModel): Comment {
    return new Comment({
      id: c.id,
      userId: c.userId,
      projectId: c.projectId,
      message: c.message,
      isActive: c.isActive,
      createdAt: c.createdAt,
      deletedAt: c.deletedAt,
    });
  }

  static toDomainList(models: CommentModel[]): Comment[] {
    return models?.map((m) => this.execute(m)) ?? [];
  }
}
