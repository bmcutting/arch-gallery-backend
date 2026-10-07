import { Query } from 'src/shared/application/interfaces/queries.interface';
import { PaginationResponse } from 'src/shared/application/responses/pagination.response';
import { PaginationResponseMapper } from 'src/shared/application/mappers/pagination-mapper';
import { UserSkillRepository } from 'src/user/domain/repositories/user-skill.repository';
import { UserSkillResponse } from './responses/user-skill.response';
import { UserSkillResponseMapper } from '../../mappers/user-skill-response-mapper';
import { UserSkillGetMineRequest } from './requests/user-skill-get-mine.request';

interface Props {
  request: UserSkillGetMineRequest;
  currentUserId: string;
}

export class UserSkillGetMineQuery implements Query<
  Props,
  PaginationResponse<UserSkillResponse>
> {
  constructor(private readonly repository: UserSkillRepository) {}

  async execute({
    request,
    currentUserId,
  }: Props): Promise<PaginationResponse<UserSkillResponse>> {
    const { items, totalItems, pagination } = await this.repository.find({
      ...request,
      userId: currentUserId,
    });

    return PaginationResponseMapper.toResponse({
      items: UserSkillResponseMapper.toResponseList(items),
      totalItems,
      ...pagination,
    });
  }
}
