import { Faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { Level } from 'src/user/domain/enums/level';
import { SkillModel } from 'src/user/infrastructure/typeorm/models/skill';
import { setSeederFactory } from 'typeorm-extension';

export const SkillFactory = setSeederFactory(SkillModel, (faker: Faker) => {
  const skill = new SkillModel();
  skill.id = randomUUID();
  skill.name = faker.word.noun();
  skill.level = faker.helpers.arrayElement([
    Level.BEGINNER,
    Level.INTERMEDIATE,
    Level.ADVANCED,
  ]);
  return skill;
});
