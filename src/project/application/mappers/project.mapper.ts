import { Project } from 'src/project/domain/entities/project.entity';
import { ProjectResponse } from '../queries/responses/project.response';
import { CategoryResponseMapper } from 'src/category/application/mappers/category.mapper';
import { UserResponseMapper } from 'src/user/application/mappers/user.mapper';

export class ProjectResponseMapper {
  static toReponse(project: Project): ProjectResponse {
    console.log(project);
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      isActive: project.isActive,
      imagesUrl: project.imagesUrl,
      createdAt: project.getCreatedAt(),
      deletedAt: project.getDeletedAt(),
      user: UserResponseMapper.toResponse(project.getUser()),
      categories: CategoryResponseMapper.toResponseList(
        project.getCategories(),
      ),
      likesCount: project.likes?.length ?? 0,
      commentsCount: project.comments?.length ?? 0,
    };
  }

  static toResponseList(projects: Project[]): ProjectResponse[] {
    return projects.map((project) => this.toReponse(project));
  }
}
