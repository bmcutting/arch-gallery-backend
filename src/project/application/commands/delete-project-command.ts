import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { DeleteProjectRequest } from './requests/delete-project.request';
import { DeleteProjectResponse } from './responses/delete-project.response';
import { Command } from 'src/shared/interfaces/command.interface';
import { NotFoundProjectException } from 'src/project/domain/exceptions/project';

export class DeleteProjectCommand implements Command<
  DeleteProjectRequest,
  DeleteProjectResponse
> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(props: DeleteProjectRequest) {
    const project = await this.projectRepository.findById(props.projectId);
    if (!project) {
      throw new NotFoundProjectException();
    }

    await this.projectRepository.delete(props.projectId);

    return { success: true };
  }
}
