import { Faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { CommentModel } from 'src/project/infrastructure/typeorm/models/comment';
import { setSeederFactory } from 'typeorm-extension';

export const CommentFactory = setSeederFactory(CommentModel, (faker: Faker) => {
  const comment = new CommentModel();
  comment.id = randomUUID();
  comment.userId = randomUUID();
  comment.projectId = randomUUID();
  comment.message = faker.lorem.sentence();
  return comment;
});
