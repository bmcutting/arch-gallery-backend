import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { Command } from 'src/shared/interfaces/command.interface';

interface AddLikeProps {
  projectId: string;
  userId: string;
}

export class AddLikeCommand implements Command<AddLikeProps, number> {
  constructor(private readonly projectRepository: ProjectRepository) {}
  async execute(props: AddLikeProps): Promise<number> {
    await this.projectRepository.addLike(props.userId, props.projectId);
    return await this.projectRepository.countLikes(props.projectId);
  }
}
