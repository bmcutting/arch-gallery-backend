import { ulid } from 'ulid';
import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category.model';
import { CommentModel } from 'src/comment/infrastructure/typeorm/models/comment.model';
import { LikeModel } from 'src/like/infrastructure/typeorm/models/like.model';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user.model';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcryptjs';
import { SkillModel } from 'src/user/infrastructure/typeorm/models/skill.model';
import { UserSkillModel } from 'src/user/infrastructure/typeorm/models/user-skill.model';
import { SkillScope } from 'src/user/domain/enums/skill-scope';
import { Level } from 'src/user/domain/enums/level';
import { seedGlobalSkills } from './global-catalogue.seeder';
import { ExperienceModel } from 'src/user/infrastructure/typeorm/models/experience.model';

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
    const experienceFactory = factoryManager.get(ExperienceModel);

    await seedGlobalSkills(dataSource);
    const globalSkills = await dataSource.getRepository(SkillModel).find({
      where: { scope: SkillScope.GLOBAL },
    });

    const users = await userFactory.saveMany(10);

    const brianUser = new UserModel();
    brianUser.id = ulid();
    brianUser.userName = 'Brian';
    brianUser.email = 'brian@gmail.com';
    brianUser.password = await bcrypt.hash('12345678', 10);
    brianUser.firstName = 'Brian';
    brianUser.lastName = 'Dev';
    const savedBrian = await dataSource
      .getRepository(UserModel)
      .save(brianUser);

    users.push(savedBrian);

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

      await this.linkSkills(dataSource, user, globalSkills);

      const experiences = await experienceFactory.make();
      experiences.user_id = user.id;
      await dataSource.getRepository(ExperienceModel).save(experiences);
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

  // Tres skills del catalogo global por usuario, con su nivel en la fila de join.
  private async linkSkills(
    dataSource: DataSource,
    user: UserModel,
    globalSkills: SkillModel[],
  ): Promise<void> {
    const levels = [Level.BEGINNER, Level.INTERMEDIATE, Level.ADVANCED];
    const picked = globalSkills.slice(0, 3);

    const rows = picked.map((skill, index) => {
      const userSkill = new UserSkillModel();
      userSkill.id = ulid();
      userSkill.user_id = user.id;
      userSkill.skill_id = skill.id;
      userSkill.level = levels[index % levels.length];
      return userSkill;
    });

    await dataSource.getRepository(UserSkillModel).save(rows);
  }
}
