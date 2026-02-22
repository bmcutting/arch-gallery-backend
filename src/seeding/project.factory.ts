import { Faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { setSeederFactory } from 'typeorm-extension';

export const ProjectFactory = setSeederFactory(ProjectModel, (faker: Faker) => {
  const project = new ProjectModel();
  project.id = randomUUID();
  project.title = faker.commerce.productName();
  project.description = faker.lorem.paragraph();
  project.year = faker.number.int({ min: 2000, max: 2026 });
  project.imagesUrl = [
    faker.image.urlPicsumPhotos(),
    faker.image.urlPicsumPhotos(),
  ];
  return project;
});
