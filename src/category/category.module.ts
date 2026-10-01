import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModel } from './infrastructure/typeorm/models/category.model';
import { CategoryController } from './infrastructure/nest/controller/category.controller';
import { TypeOrmCategoryRepository } from './infrastructure/typeorm/repository/category';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project.model';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    TypeOrmModule.forFeature([CategoryModel, ProjectModel]),
  ],
  controllers: [CategoryController],
  providers: [TypeOrmCategoryRepository],
  exports: [TypeOrmCategoryRepository],
})
export class CategoryModule {}
