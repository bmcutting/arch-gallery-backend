import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModel } from 'src/comment/infrastructure/typeorm/models/comment.model';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project.model';
import { LikeModel } from './infrastructure/typeorm/models/like.model';
import { TypeOrmProjectRepository } from 'src/project/infrastructure/typeorm/repository/project';
import { JwtService } from '@nestjs/jwt';
import { LikeController } from './infrastructure/nest/controllers/like.controller';
import { TypeOrmLikeRepository } from './infrastructure/typeorm/repository/like';
import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectModel,
      CommentModel,
      LikeModel,
      CategoryModel,
    ]),
  ],
  controllers: [LikeController],
  providers: [TypeOrmProjectRepository, TypeOrmLikeRepository, JwtService],
  exports: [TypeOrmLikeRepository],
})
export class LikeModule {}
