import { Like } from 'src/project/domain/entities/like.entity';
import { LikeModel } from '../models/like';

export class LikeTypeOrmMapper {
  constructor() {}
  static execute(l: LikeModel): Like {
    return new Like({
      id: l.id,
      userId: l.userId,
      projectId: l.projectId,
      isActive: l.isActive,
      createdAt: l.createdAt,
      deletedAt: l.deletedAt,
    });
  }

  static toDomainList(models: LikeModel[]): Like[] {
    return models?.map((m) => this.execute(m)) ?? [];
  }
}
