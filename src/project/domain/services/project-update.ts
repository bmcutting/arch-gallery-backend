import { Project } from '../entities/project.entity';
import { ProjectRepository } from '../repositories/project.repository';

export interface UpdateProjectProps {
  title?: string;
  description?: string;
  year?: number;
}

export class UpdateProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(project: Project, props: UpdateProjectProps): Promise<Project> {
    let hasChanges = false;

    if (props.title !== undefined && props.title !== project.getTitle()) {
      project.setTitle(props.title);
      hasChanges = true;
    }

    if (
      props.description !== undefined &&
      props.description !== project.getDescription()
    ) {
      project.setDescription(props.description);
      hasChanges = true;
    }

    if (props.year !== undefined && props.year !== project.getYear()) {
      project.setYear(props.year);
      hasChanges = true;
    }
    if (hasChanges) {
      await this.projectRepository.update(project);
    }

    return project;
  }
}
