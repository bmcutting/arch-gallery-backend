import { Faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { LikeModel } from 'src/project/infrastructure/typeorm/models/like';
import { setSeederFactory } from 'typeorm-extension';

export const LikeFactory = setSeederFactory(LikeModel, (faker: Faker) => {
  const like = new LikeModel();
  like.id = randomUUID();
  like.userId = randomUUID();
  like.projectId = randomUUID();
  return like;
});
