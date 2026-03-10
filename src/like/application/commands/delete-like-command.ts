import { Command } from 'src/shared/interfaces/command.interface';
import { DeleteLikeRequest } from './requests/delete-like.request';
import { LikeRepository } from 'src/like/domain/repositories/like.repository';

export class DeleteLikeCommand implements Command<DeleteLikeRequest, number> {
  constructor(private readonly likeRepository: LikeRepository) {}

  async execute(props: DeleteLikeRequest): Promise<number> {
    await this.likeRepository.removeLike(props.projectId, props.userId);

    const likesCount = await this.likeRepository.countLikes(props.projectId);
    return likesCount;
  }
}
