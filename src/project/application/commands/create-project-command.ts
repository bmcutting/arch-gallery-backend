import { Command } from 'src/shared/interfaces/command.interface';
import { CreateProjectRequest } from './requests/create-project.request';
import { CreateProjectResponse } from './responses/create-project.response';
import { ProjectCreator } from 'src/project/domain/services/project-create';

export class CreateProjectCommand implements Command<
  CreateProjectRequest,
  CreateProjectResponse
> {
  constructor(private readonly createProjectService: ProjectCreator) {}

  async execute(props: CreateProjectRequest): Promise<CreateProjectResponse> {
    const projectId = await this.createProjectService.execute({
      title: props.title,
      description: props.description,
      year: props.year,
      categories: props.categories,
      userId: props.userId,
    });

    return { id: projectId };
  }
}
