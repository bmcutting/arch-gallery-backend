import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModel } from './infrastructure/typeorm/models/project';
import { ProjectController } from './infrastructure/nest/controllers/project.controller';
import { TypeOrmProjectRepository } from './infrastructure/typeorm/repository/project';
import { TypeOrmUserRepository } from 'src/user/infrastructure/typeorm/repository/user';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { LikeModel } from './infrastructure/typeorm/models/like';
import { CommentModel } from './infrastructure/typeorm/models/comment';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectModel,
      UserModel,
      LikeModel,
      CommentModel,
    ]),
  ],
  controllers: [ProjectController],
  providers: [TypeOrmProjectRepository, TypeOrmUserRepository],
  exports: [TypeOrmProjectRepository],
})
export class ProjectModule {}
