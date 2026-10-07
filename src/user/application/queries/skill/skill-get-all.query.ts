import { Query } from 'src/shared/application/interfaces/queries.interface';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { PaginationResponseMapper } from 'src/shared/application/mappers/pagination-mapper';
import { SkillRepository } from 'src/user/domain/repositories/skill.repository';
import { SkillResponse } from './responses/skill.response';
import { SkillResponseMapper } from '../../mappers/skill-response-mapper';
import { SkillGetAllRequest } from './requests/skill-get-all.request';

interface Props {
  request: SkillGetAllRequest;
  currentUserId: string;
}

export class SkillGetAllQuery implements Query<
  Props,
  PaginationResponse<SkillResponse>
> {
  constructor(private readonly skillRepository: SkillRepository) {}

  async execute({
    request,
    currentUserId,
  }: Props): Promise<PaginationResponse<SkillResponse>> {
    const { items, totalItems, pagination } = await this.skillRepository.find({
      ...request,
      viewerId: currentUserId,
    });

    return PaginationResponseMapper.toResponse({
      items: SkillResponseMapper.toResponseList(items),
      totalItems,
      ...pagination,
    });
  }
}
