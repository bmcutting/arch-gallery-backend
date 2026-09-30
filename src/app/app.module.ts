import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { EnvModule } from 'src/env/env.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { EnvService } from 'src/env/services/env';
import { ProjectModule } from 'src/project/project.module';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { CategoryModule } from 'src/category/category.module';
import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category';
import { CommentModel } from 'src/comment/infrastructure/typeorm/models/comment';
import { LikeModel } from 'src/like/infrastructure/typeorm/models/like';
import { RefreshTokenModel } from 'src/authentication/infrastructure/typeorm/models/refresh-token.model';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { CommentModule } from 'src/comment/comment.module';
import { LikeModule } from 'src/like/like.module';
import { SkillModel } from 'src/user/infrastructure/typeorm/models/skill';
import { ExperienceModel } from 'src/user/infrastructure/typeorm/models/experience';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    EnvModule,
    SharedModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory(envServices: EnvService) {
        return {
          type: 'postgres',
          host: envServices.DB_HOST,
          port: envServices.DB_PORT,
          password: envServices.DB_PASSWORD,
          username: envServices.DB_USERNAME,
          database: envServices.DB_NAME,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
