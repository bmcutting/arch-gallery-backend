import { Query } from 'src/shared/interfaces/queries.interface';
import { GetProjectFeedRequest } from './requests/project-feed.request';
import { ProjectFeedResponse } from './responses/project-feed.response';
import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { ProjectResponseMapper } from '../mappers/project.mapper';

export class GetProjectFeedQuery implements Query<
  GetProjectFeedRequest,
  Promise<ProjectFeedResponse[]>
> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(
    request: GetProjectFeedRequest,
  ): Promise<ProjectFeedResponse[]> {
    const projects = await this.projectRepository.getProjectFeed(
      request.cursor,
      request.limit,
    );

    return ProjectResponseMapper.toProjectFeedList(projects);
  }
}
