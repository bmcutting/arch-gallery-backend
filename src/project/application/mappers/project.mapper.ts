import { Project } from 'src/project/domain/entities/project.entity';
import { ProjectResponse } from '../queries/responses/project.response';
import { CategoryResponseMapper } from 'src/category/application/mappers/category.mapper';
import { UserResponseMapper } from 'src/user/application/mappers/user.mapper';
import { ProjectFeedResponse } from '../queries/responses/project-feed.response';

export class ProjectResponseMapper {
  static toReponse(project: Project): ProjectResponse {
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      year: project.year,
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

  static toProjectFeed(project: Project): ProjectFeedResponse {
    return {
      id: project.id,
      createdAt: project.createdAt,
      title: project.title,
      previewImage: project.imagesUrl[0],
      likesCount: project.likes?.length ?? 0,
      commentsCount: project.comments?.length ?? 0,
      author: {
        id: project.getUser().id,
        name: project.getUser().userName,
        profileImage: project.getUser().profileImageUrl,
      },
    };
  }

  static toProjectFeedList(projects: Project[]): ProjectFeedResponse[] {
    return projects.map((project) => this.toProjectFeed(project));
  }
}
