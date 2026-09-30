import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModel } from './infrastructure/typeorm/models/category.model';
import { CategoryController } from './infrastructure/nest/controller/category.controller';
import { TypeOrmCategoryRepository } from './infrastructure/typeorm/repository/category';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project.model';
import { TypeOrmProjectRepository } from 'src/project/infrastructure/typeorm/repository/project';
import { LikeModel } from 'src/like/infrastructure/typeorm/models/like.model';
import { CommentModel } from 'src/comment/infrastructure/typeorm/models/comment.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryModel,
      ProjectModel,
      LikeModel,
      CommentModel,
    ]),
  ],
  controllers: [CategoryController],
  providers: [TypeOrmCategoryRepository, TypeOrmProjectRepository, JwtService],
  exports: [TypeOrmCategoryRepository],
})
export class CategoryModule {}
