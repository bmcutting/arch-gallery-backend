import { Query } from 'src/shared/interfaces/queries.interface';
import { GetProjectByIdRequest } from './requests/project-get-by-id.request';
import { ProjectResponse } from './responses/project.response';
import { ProjectRepository } from 'src/project/domain/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { ProjectResponseMapper } from '../mappers/project.mapper';

export class GetProjectByIdQuery implements Query<
  GetProjectByIdRequest,
  Promise<ProjectResponse>
> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute({ id }: GetProjectByIdRequest): Promise<ProjectResponse> {
    const found = await this.projectRepository.findById(id);

    if (found && !found.deletedAt) {
      return ProjectResponseMapper.toReponse(found);
    }

    throw new NotFoundException();
  }
}
