import { Command } from 'src/shared/interfaces/command.interface';
import { UpdateProjectRequest } from './requests/update-project.request';
import { UpdateProjectResponse } from './responses/update-project.response';
import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { UpdateProject } from 'src/project/domain/services/project-update';
import { NotFoundProjectException } from 'src/project/domain/exceptions/project';

interface UpdateProjectProps {
  request: UpdateProjectRequest;
  projectId: string;
}

export class UpdateProjectCommand implements Command<
  UpdateProjectProps,
  UpdateProjectResponse
> {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly updateProjectService: UpdateProject,
  ) {}

  async execute(props: UpdateProjectProps): Promise<UpdateProjectResponse> {
    const project = await this.projectRepository.findById(props.projectId);
    if (!project) {
      throw new NotFoundProjectException();
    }

    await this.updateProjectService.execute(project, {
      title: props.request.title,
      description: props.request.description,
      year: props.request.year,
      imagesUrl: props.request.imagesUrl,
      categories: props.request.categories,
    });

    return { success: true };
  }
}
