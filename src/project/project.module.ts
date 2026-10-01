import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModel } from './infrastructure/typeorm/models/project.model';
import { ProjectController } from './infrastructure/nest/controllers/project.controller';
import { TypeOrmProjectRepository } from './infrastructure/typeorm/repository/project';
import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category.model';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([ProjectModel, CategoryModel]),
  ],
  controllers: [ProjectController],
  providers: [TypeOrmProjectRepository],
  exports: [TypeOrmProjectRepository],
})
export class ProjectModule {}
