import { Command } from 'src/shared/interfaces/command.interface';
import { AddCommentRequest } from '../requests/add-comment.request';
import { NotFoundProjectException } from 'src/project/domain/exceptions/project';
import { CommentRepository } from 'src/comment/domain/repositories/comment.repository';
import { ProjectRepository } from 'src/project/domain/repositories/project.repository';

interface AddCommentProps {
  request: AddCommentRequest;
  projectId: string;
  userId: string;
}

export class AddCommentCommand implements Command<AddCommentProps, number> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(props: AddCommentProps): Promise<number> {
    const project = await this.projectRepository.findById(props.projectId);
    if (!project) {
      throw new NotFoundProjectException();
    }

    await this.commentRepository.addComment(
      props.userId,
      props.projectId,
      props.request.message,
    );

    return await this.commentRepository.countComments(props.projectId);
  }
}
