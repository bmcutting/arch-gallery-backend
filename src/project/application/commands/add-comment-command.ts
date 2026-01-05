import { Command } from 'src/shared/interfaces/command.interface';
import { AddCommentRequest } from './requests/add-comment.request';
import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { NotFoundProjectException } from 'src/project/domain/exceptions/project';

interface AddCommentProps {
  request: AddCommentRequest;
  projectId: string;
  userId: string;
}

export class AddCommentCommand implements Command<AddCommentProps, number> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(props: AddCommentProps): Promise<number> {
    const project = await this.projectRepository.findById(props.projectId);
    if (!project) {
      throw new NotFoundProjectException();
    }

    await this.projectRepository.addComment(
      props.userId,
      props.projectId,
      props.request.message,
    );

    return await this.projectRepository.countComments(props.projectId);
  }
}
