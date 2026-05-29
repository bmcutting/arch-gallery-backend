import { Query } from 'src/shared/interfaces/queries.interface';
import { ProjectPaginationRequest } from './requests/project-pagination.request';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { ProjectResponseMapper } from '../mappers/project.mapper';
import { PaginationResponseMapper } from 'src/shared/application/mappers/pagination-mapper';
import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { ProjectFeedResponse } from './responses/project-feed.response';

export class GetAllProjectsQuery implements Query<
  ProjectPaginationRequest,
  Promise<PaginationResponse<ProjectFeedResponse>>
> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(
    request: ProjectPaginationRequest,
  ): Promise<PaginationResponse<ProjectFeedResponse>> {
    const {
      items: projects,
      totalItems,
      pagination,
    } = await this.projectRepository.findAll({
      page: request.page,
      pageSize: request.pageSize,
      search: request.search,
      createdAtMin: request.createdAtMin,
      createdAtMax: request.createdAtMax,
      title: request.title,
      deletedAtMax: request.deletedAtMax,
      deletedAtMin: request.deletedAtMin,
      includeDeleted: request.includeDeleted,
      onlyDeleted: request.onlyDeleted,
      sort: request.sort,
    });

    const responses = ProjectResponseMapper.toResponseList(projects);

    const items: ProjectFeedResponse[] = responses.map((response) => ({
      project: response,
      likedByUser:
        response.likes?.some((like) => like.userId === request.currentUserId) ??
        false,
    }));

    return PaginationResponseMapper.toResponse({
      items,
      totalItems,
      ...pagination,
    });
  }
}
