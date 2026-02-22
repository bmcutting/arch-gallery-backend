import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category';
import { CommentModel } from 'src/project/infrastructure/typeorm/models/comment';
import { LikeModel } from 'src/project/infrastructure/typeorm/models/like';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = factoryManager.get(UserModel);
    const projectFactory = factoryManager.get(ProjectModel);
    const categoryFactory = factoryManager.get(CategoryModel);
    const commentFactory = factoryManager.get(CommentModel);
    const likeFactory = factoryManager.get(LikeModel);

    const users = await userFactory.saveMany(10);

    const categoryNames = faker.helpers.uniqueArray(
      () => faker.commerce.department(),
      5,
    );

    const categories: CategoryModel[] = [];
    for (const name of categoryNames) {
      const category = await categoryFactory.make();
      category.name = name;
      const savedCategory = await dataSource
        .getRepository(CategoryModel)
        .save(category);
      categories.push(savedCategory);
    }
    const projects: ProjectModel[] = [];
    for (const user of users) {
      const project = await projectFactory.make();
      project.user = user;
      project.categories = categories.slice(0, 2);
      const savedProject = await dataSource
        .getRepository(ProjectModel)
        .save(project);
      projects.push(savedProject);
    }
    for (const project of projects) {
      const comment = await commentFactory.make();
      comment.user = users[Math.floor(Math.random() * users.length)];
      comment.project = project;
      await dataSource.getRepository(CommentModel).save(comment);
      const like = await likeFactory.make();
      like.user = users[Math.floor(Math.random() * users.length)];
      like.project = project;
      await dataSource.getRepository(LikeModel).save(like);
    }
  }
}
