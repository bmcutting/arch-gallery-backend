import { Query } from 'src/shared/application/interfaces/queries.interface';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { PaginationResponseMapper } from 'src/shared/application/mappers/pagination-mapper';
import { ExperienceRepository } from 'src/user/domain/repositories/experience.repository';
import { ExperienceResponse } from './responses/experience.response';
import { ExperienceResponseMapper } from '../../mappers/experience-response-mapper';
import { ExperienceGetMineRequest } from './requests/experience-get-mine.request';

interface Props {
  request: ExperienceGetMineRequest;
  currentUserId: string;
}

export class ExperienceGetMineQuery implements Query<
  Props,
  PaginationResponse<ExperienceResponse>
> {
  constructor(private readonly repository: ExperienceRepository) {}

  async execute({
    request,
    currentUserId,
  }: Props): Promise<PaginationResponse<ExperienceResponse>> {
    const { items, totalItems, pagination } = await this.repository.find({
      ...request,
      userId: currentUserId,
    });

    return PaginationResponseMapper.toResponse({
      items: ExperienceResponseMapper.toResponseList(items),
      totalItems,
      ...pagination,
    });
  }
}
