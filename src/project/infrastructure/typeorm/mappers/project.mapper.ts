import { Project } from 'src/project/domain/entities/project.entity';
import { ProjectModel } from '../models/project';
import { UserTypeOrmMapper } from 'src/user/infrastructure/typeorm/mappers/user-mapper';
import { CategoryTypeOrmMapper } from 'src/category/infrastructure/typeorm/mappers/category.mapper';
import { LikeTypeOrmMapper } from './like.mapper';
import { CommentTypeOrmMapper } from './comment.mapper';

export class ProjectTypeOrmMapper {
  constructor() {}

  static execute(p: ProjectModel): Project {
    return new Project({
      id: p.id,
      title: p.title,
      isActive: true,
      description: p.description,
      year: p.year,
      imagesUrl: p.imagesUrl,
      user: UserTypeOrmMapper.execute(p.user),
      categories: p.categories
        ? CategoryTypeOrmMapper.toDomainList(p.categories)
        : [],
      likes: p.likes ? LikeTypeOrmMapper.toDomainList(p.likes) : [],
      comments: p.comments ? CommentTypeOrmMapper.toDomainList(p.comments) : [],
    });
  }
}
