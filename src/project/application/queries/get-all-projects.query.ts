import { Query } from 'src/shared/interfaces/queries.interface';
import { ProjectPaginationRequest } from './requests/project-pagination.request';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { ProjectResponse } from './responses/project.response';
import { ProjectResponseMapper } from '../mappers/project.mapper';
import { PaginationResponseMapper } from 'src/shared/application/mappers/pagination-mapper';
import { ProjectRepository } from 'src/project/domain/repositories/project.repository';

export class GetAllProjectsQuery implements Query<
  ProjectPaginationRequest,
  Promise<PaginationResponse<ProjectResponse>>
> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(
    request: ProjectPaginationRequest,
  ): Promise<PaginationResponse<ProjectResponse>> {
    const { items, totalItems, pagination } =
      await this.projectRepository.findAll({
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

    return PaginationResponseMapper.toResponse({
      items: ProjectResponseMapper.toResponseList(items),
      totalItems,
      ...pagination,
    });
  }
}
