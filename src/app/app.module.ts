import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { EnvModule } from './modules/env/env.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { EnvService } from 'src/app/modules/env/services/env';
import { ProjectModule } from 'src/project/project.module';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { CategoryModule } from 'src/category/category.module';
import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category';
import { CommentModel } from 'src/comment/infrastructure/typeorm/models/comment';
import { LikeModel } from 'src/like/infrastructure/typeorm/models/like';
import { RefreshTokenModel } from 'src/authentication/infrastructure/typeorm/models/refresh-token.model';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ConfigutationModule } from 'src/configuration/config.module';
import { CommentModule } from 'src/comment/comment.module';
import { LikeModule } from 'src/like/like.module';
import { SkillModel } from 'src/user/infrastructure/typeorm/models/skill';
import { ExperienceModel } from 'src/user/infrastructure/typeorm/models/experience';

@Module({
  imports: [
    EnvModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory(envServices: EnvService) {
        return {
          type: 'postgres',
          host: envServices.DATABASE_HOST,
          port: envServices.DATABASE_PORT,
          password: envServices.DATABASE_PASSWORD,
          username: envServices.DATABASE_USERNAME,
          database: envServices.DATABASE_NAME,
          ssl: { rejectUnauthorized: false },
          synchronize: true,
          logging: false,
          dropSchema: false,
          entities: [
            UserModel,
            ProjectModel,
            CategoryModel,
            CommentModel,
            LikeModel,
            RefreshTokenModel,
            SkillModel,
            ExperienceModel,
          ],
        };
      },
      inject: [EnvService],
      imports: [EnvModule],
    }),
    UserModule,
    ProjectModule,
    CategoryModule,
    CommentModule,
    LikeModule,
    AuthenticationModule,
    ConfigutationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
