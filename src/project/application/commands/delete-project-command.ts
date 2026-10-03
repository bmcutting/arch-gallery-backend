import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { DeleteProjectRequest } from './requests/delete-project.request';
import { DeleteProjectResponse } from './responses/delete-project.response';
import { Command } from 'src/shared/application/interfaces/command.interface';
import { NotFoundProjectException } from 'src/project/domain/exceptions/project';
import { ensureResourceOwner } from 'src/authorization/domain/services/ensure-resource-owner';

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

    ensureResourceOwner({
      ownerId: project.getUser().getId(),
      userId: props.currentUserId,
    });

    await this.projectRepository.delete(props.projectId);

    return { success: true };
  }
}
