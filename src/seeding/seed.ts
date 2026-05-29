import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { UserFactory } from './user.factory';
import { MainSeeder } from './main.seeder';
import { UserModel } from '../user/infrastructure/typeorm/models/user';
import { CommentModel } from '../comment/infrastructure/typeorm/models/comment';
import { ProjectModel } from '../project/infrastructure/typeorm/models/project';
import { LikeModel } from '../like/infrastructure/typeorm/models/like';
import { CategoryModel } from '../category/infrastructure/typeorm/models/category';
import 'dotenv/config';
import { ProjectFactory } from './project.factory';
import { LikeFactory } from './like.factory';
import { CategoryFactory } from './category.factory';
import { CommentFactory } from './comment.factory';
import { SkillModel } from 'src/user/infrastructure/typeorm/models/skill';
import { ExperienceModel } from 'src/user/infrastructure/typeorm/models/experience';
import { SkillFactory } from './skill.factory';
import { ExperienceFactory } from './experience.factory';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: true,
  logging: false,
  dropSchema: false,
  entities: [
    UserModel,
    CommentModel,
    LikeModel,
    CategoryModel,
    ProjectModel,
    SkillModel,
    ExperienceModel,
  ],
  seeds: [MainSeeder],
  factories: [
    UserFactory,
    ProjectFactory,
    LikeFactory,
    CategoryFactory,
    CommentFactory,
    SkillFactory,
    ExperienceFactory,
  ],
};

const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
