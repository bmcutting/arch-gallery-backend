import { Faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { UserModel } from '../user/infrastructure/typeorm/models/user';
import { setSeederFactory } from 'typeorm-extension';

export const UserFactory = setSeederFactory(UserModel, (faker: Faker) => {
  const user = new UserModel();
  user.id = randomUUID();
  user.userName = faker.internet.username();
  user.email = faker.internet.email();
  user.password = faker.internet.password({ length: 12 });
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.phoneNumber = faker.phone.number();
  user.bio = faker.lorem.sentence();
  user.profileImageUrl = faker.image.avatar();
  user.website = faker.internet.url();
  user.location = faker.location.city();
  user.experienceYears = faker.number.int({ min: 0, max: 20 });
  user.specialization = faker.person.jobTitle();
  user.instagramUrl = `https://instagram.com/${faker.internet.username()}`;
  user.twitterUrl = `https://twitter.com/${faker.internet.username()}`;
  user.linkedinUrl = `https://linkedin.com/in/${faker.internet.username()}`;
  const lang1: string = faker.location.language().name;
  const lang2: string = faker.location.language().name;
  user.languages = [lang1, lang2];
  return user;
});
