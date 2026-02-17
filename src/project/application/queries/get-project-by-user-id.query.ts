import { Query } from 'src/shared/interfaces/queries.interface';
import { GetProjectByUserIdRequest } from './requests/project-get-by-user-id.request';
import { ProjectResponse } from './responses/project.response';
import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { ProjectResponseMapper } from '../mappers/project.mapper';
import { NotFoundException } from '@nestjs/common';

export class GetProjectByUserIdQuery implements Query<
  GetProjectByUserIdRequest,
  Promise<ProjectResponse[]>
> {
  constructor(private readonly projectRepository: ProjectRepository) {}
  async execute({ id }: GetProjectByUserIdRequest): Promise<ProjectResponse[]> {
    const projects = await this.projectRepository.findByUserId(id);
    if (!projects || projects.length === 0) {
      throw new NotFoundException(`No projects found for user ${id}`);
    }
    return ProjectResponseMapper.toResponseList(
      projects.filter((p) => !p.deletedAt),
    );
  }
}
