import { Query } from 'src/shared/interfaces/queries.interface';
import { GetProjectByUserIdRequest } from './requests/project-get-by-user-id.request';
import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { ProjectResponseMapper } from '../mappers/project.mapper';
import { NotFoundException } from '@nestjs/common';
import { ProjectFeedResponse } from './responses/project-feed.response';

export class GetProjectByUserIdQuery implements Query<
  GetProjectByUserIdRequest,
  Promise<ProjectFeedResponse[]>
> {
  constructor(private readonly projectRepository: ProjectRepository) {}
  async execute({
    id,
  }: GetProjectByUserIdRequest): Promise<ProjectFeedResponse[]> {
    const projects = await this.projectRepository.findByUserId(id);
    if (!projects || projects.length === 0) {
      throw new NotFoundException(`No projects found for user ${id}`);
    }

    return projects
      .filter((p) => !p.deletedAt)
      .map((p) => ({
        project: ProjectResponseMapper.toReponse(p),
        likedByUser: p.likes?.some((like) => like.userId === id) ?? false,
      }));
  }
}
