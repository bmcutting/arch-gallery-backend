import { Project } from 'src/project/domain/entities/project.entity';
import { ProjectModel } from '../models/project';
import { UserTypeOrmMapper } from 'src/user/infrastructure/typeorm/mappers/user-mapper';
import { CategoryTypeOrmMapper } from 'src/category/infrastructure/typeorm/mappers/category.mapper';

export class ProjectTypeOrmMapper {
  constructor() {}

  static execute(p: ProjectModel): Project {
    return new Project({
      id: p.id,
      title: p.title,
      isActive: true,
      description: p.description,
      imagesUrl: p.imagesUrl,
      user: UserTypeOrmMapper.execute(p.user),
      categories: CategoryTypeOrmMapper.toDomainList(p.categories),
    });
  }
}
