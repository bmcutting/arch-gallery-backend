import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModel } from './infrastructure/typeorm/models/project.model';
import { ProjectController } from './infrastructure/nest/controllers/project.controller';
import { TypeOrmProjectRepository } from './infrastructure/typeorm/repository/project';
import { TypeOrmUserRepository } from 'src/user/infrastructure/typeorm/repository/user';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user.model';
import { LikeModel } from '../like/infrastructure/typeorm/models/like.model';
import { CommentModel } from '../comment/infrastructure/typeorm/models/comment.model';
import { JwtService } from '@nestjs/jwt';
import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectModel,
      UserModel,
      LikeModel,
      CommentModel,
      CategoryModel,
    ]),
  ],
  controllers: [ProjectController],
  providers: [TypeOrmProjectRepository, TypeOrmUserRepository, JwtService],
  exports: [TypeOrmProjectRepository],
})
export class ProjectModule {}
