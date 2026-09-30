import { Faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category.model';
import { setSeederFactory } from 'typeorm-extension';

export const CategoryFactory = setSeederFactory(
  CategoryModel,
  (faker: Faker) => {
    const category = new CategoryModel();
    category.id = ulid();
    category.name = faker.commerce.department();
    return category;
  },
);
