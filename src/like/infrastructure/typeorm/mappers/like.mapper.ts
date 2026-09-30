import { Like } from 'src/like/domain/entities/like.entity';
import { LikeModel } from '../models/like.model';

export class LikeTypeOrmMapper {
  constructor() {}
  static execute(l: LikeModel): Like {
    return new Like({
      id: l.id,
      userId: l.user_id,
      projectId: l.project_id,
      isActive: l.isActive,
      createdAt: l.createdAt,
      deletedAt: l.deletedAt,
    });
  }

  static toDomainList(models: LikeModel[]): Like[] {
    return models?.map((m) => this.execute(m)) ?? [];
  }
}
