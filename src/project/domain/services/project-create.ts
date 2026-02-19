import { NotFoundUserException } from 'src/user/domain/exceptions/user';
import { ProjectRepository } from '../repositories/project.repository';
import { UserRepository } from 'src/user/domain/repositories/user.repository';

export interface CreateProjectProps {
  title: string;
  description?: string;
  year: number;
  userId: string;
}

export class ProjectCreator {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(props: CreateProjectProps) {
    const user = await this.userRepository.findById(props.userId);
    if (!user) {
      throw new NotFoundUserException();
    }

    const projectId = await this.projectRepository.create({
      title: props.title,
      description: props.description,
      year: props.year,
      userId: props.userId,
    });

    return projectId;
  }
}
