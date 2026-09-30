import { Faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { ExperienceType } from 'src/user/domain/enums/experience';
import { ExperienceModel } from 'src/user/infrastructure/typeorm/models/experience.model';
import { setSeederFactory } from 'typeorm-extension';

export const ExperienceFactory = setSeederFactory(
  ExperienceModel,
  (faker: Faker) => {
    const experience = new ExperienceModel();
    experience.id = ulid();
    experience.type = faker.helpers.arrayElement([
      ExperienceType.EDUCATION,
      ExperienceType.WORK,
    ]);
    experience.title = faker.company.name();
    experience.institutionOrCompany = faker.company.name();
    experience.description = faker.lorem.sentence();
    experience.startYear = faker.date.past().getFullYear();
    experience.endYear = faker.date.recent().getFullYear();
    experience.isCurrent = experience.endYear ? false : true;
    return experience;
  },
);
