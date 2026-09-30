import { ulid } from 'ulid';
import { LikeModel } from 'src/like/infrastructure/typeorm/models/like.model';
import { setSeederFactory } from 'typeorm-extension';

export const LikeFactory = setSeederFactory(LikeModel, () => {
  const like = new LikeModel();
  like.id = ulid();
  like.user_id = ulid();
  like.project_id = ulid();
  return like;
});
