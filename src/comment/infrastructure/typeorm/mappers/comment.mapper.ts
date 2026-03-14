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
      user: c.user
        ? {
            id: c.user.id,
            userName: c.user.userName,
            profileImageUrl: c.user.profileImageUrl,
          }
        : {
            id: '',
            userName: 'Usuario desconocido',
            profileImageUrl: '',
          },
    });
  }

  static toDomainList(models: CommentModel[]): Comment[] {
    return models?.map((m) => this.execute(m)) ?? [];
  }
}
