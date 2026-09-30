import { Faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { CommentModel } from 'src/comment/infrastructure/typeorm/models/comment.model';
import { setSeederFactory } from 'typeorm-extension';

export const CommentFactory = setSeederFactory(CommentModel, (faker: Faker) => {
  const comment = new CommentModel();
  comment.id = ulid();
  comment.user_id = ulid();
  comment.project_id = ulid();
  comment.message = faker.lorem.sentence();
  return comment;
});
