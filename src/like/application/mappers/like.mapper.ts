import { Like } from 'src/like/domain/entities/like.entity';
import { LikeResponse } from '../commands/responses/like.response';

export class LikeResponseMapper {
  static toReponse(like: Like): LikeResponse {
    return {
      id: like.id,
      userId: like.userId,
      projectId: like.projectId,
    };
  }

  static toResponseList(likes: Like[]): LikeResponse[] {
    return likes.map((like) => this.toReponse(like));
  }
}
