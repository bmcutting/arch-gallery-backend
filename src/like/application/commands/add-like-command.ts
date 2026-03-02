import { LikeRepository } from 'src/like/domain/repositories/like.repository';
import { Command } from 'src/shared/interfaces/command.interface';

interface AddLikeProps {
  projectId: string;
  userId: string;
}

export class AddLikeCommand implements Command<AddLikeProps, number> {
  constructor(private readonly likeRepository: LikeRepository) {}
  async execute(props: AddLikeProps): Promise<number> {
    await this.likeRepository.addLike(props.userId, props.projectId);
    return await this.likeRepository.countLikes(props.projectId);
  }
}
