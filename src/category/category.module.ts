import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModel } from './infrastructure/typeorm/models/category';
import { CategoryController } from './infrastructure/nest/controller/category.controller';
import { TypeOrmCategoryRepository } from './infrastructure/typeorm/repository/category';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { TypeOrmProjectRepository } from 'src/project/infrastructure/typeorm/repository/project';
import { LikeModel } from 'src/project/infrastructure/typeorm/models/like';
import { CommentModel } from 'src/comment/infrastructure/typeorm/models/comment';

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
  providers: [TypeOrmCategoryRepository, TypeOrmProjectRepository],
  exports: [TypeOrmCategoryRepository],
})
export class CategoryModule {}
