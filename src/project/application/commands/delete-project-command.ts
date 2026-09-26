import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { DeleteProjectRequest } from './requests/delete-project.request';
import { DeleteProjectResponse } from './responses/delete-project.response';
import { Command } from 'src/shared/interfaces/command.interface';
import { NotFoundProjectException } from 'src/project/domain/exceptions/project';
import { ForbiddenException } from '@nestjs/common';

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

    if (project.getUser().getId() !== props.currentUserId) {
      throw new ForbiddenException(
        'No puedes eliminar un proyecto de otro usuario',
      );
    }

    await this.projectRepository.delete(props.projectId);

    return { success: true };
  }
}
