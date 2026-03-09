import { Query } from 'src/shared/interfaces/queries.interface';
import { GetProjectFeedRequest } from './requests/project-feed.request';
import { ProjectFeedResponse } from './responses/project-feed.response';
import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { ProjectResponseMapper } from '../mappers/project.mapper';

export interface GetProjectFeedResponse {
  items: ProjectFeedResponse[];
  nextCursor: string | null;
}

export class GetProjectFeedQuery implements Query<
  GetProjectFeedRequest,
  Promise<GetProjectFeedResponse>
> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(
    request: GetProjectFeedRequest,
  ): Promise<GetProjectFeedResponse> {
    const projects = await this.projectRepository.getProjectFeed(
      request.cursor,
      request.limit,
    );

    let nextCursor: string | null = null;
    const limit = request.limit || 10;

    if (projects.length >= limit) {
      const nextItem = projects[limit - 1];
      nextCursor = nextItem.id;
      projects.pop();
    }

    const items = ProjectResponseMapper.toProjectFeedList(
      projects,
      request.currentUserId,
    );

    return {
      items,
      nextCursor,
    };
  }
}
