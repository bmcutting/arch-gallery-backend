import { Project } from 'src/project/domain/entities/project.entity';
import { ProjectResponse } from '../queries/responses/project.response';
import { CategoryResponseMapper } from 'src/category/application/mappers/category.mapper';

export class ProjectResponseMapper {
  static toReponse(project: Project): ProjectResponse {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      isActive: project.isActive,
      imagesUrl: project.imagesUrl,
      createdAt: project.getCreatedAt(),
      deletedAt: project.getDeletedAt(),
      user: project.user,
      categories: CategoryResponseMapper.toResponseList(
        project.getCategories(),
      ),
    };
  }

  static toResponseList(projects: Project[]): ProjectResponse[] {
    return projects.map((project) => this.toReponse(project));
  }
}
