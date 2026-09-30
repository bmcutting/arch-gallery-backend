import { Faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project.model';
import { setSeederFactory } from 'typeorm-extension';

export const ProjectFactory = setSeederFactory(ProjectModel, (faker: Faker) => {
  const project = new ProjectModel();
  project.id = ulid();
  project.title = faker.commerce.productName();
  project.description = faker.lorem.paragraph();
  project.year = faker.number.int({ min: 2000, max: 2026 });
  project.imagesUrl = [
    faker.image.urlPicsumPhotos(),
    faker.image.urlPicsumPhotos(),
  ];
  return project;
});
