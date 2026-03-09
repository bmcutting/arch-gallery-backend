import { Command } from 'src/shared/interfaces/command.interface';
import { DeleteLikeRequest } from './requests/delete-like.request';
import { DeleteLikeResponse } from './responses/delete-like.response';
import { LikeRepository } from 'src/like/domain/repositories/like.repository';
import { NotFoundLikeException } from 'src/like/domain/exceptions/like';

export class DeleteLikeCommand implements Command<
  DeleteLikeRequest,
  DeleteLikeResponse
> {
  constructor(private readonly likeRepository: LikeRepository) {}

  async execute(props: DeleteLikeRequest): Promise<DeleteLikeResponse> {
    const like = await this.likeRepository.findById(props.likeId);
    if (!like) {
      throw new NotFoundLikeException();
    }

    await this.likeRepository.removeLike(props.likeId);

    const likesCount = await this.likeRepository.countLikes(like.projectId);

    return { likesCount };
  }
}
