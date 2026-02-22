import { Faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category';
import { setSeederFactory } from 'typeorm-extension';

export const CategoryFactory = setSeederFactory(
  CategoryModel,
  (faker: Faker) => {
    const category = new CategoryModel();
    category.id = randomUUID();
    category.name = faker.commerce.department();
    return category;
  },
);
