import { Query } from 'src/shared/interfaces/queries.interface';
import { SkillResponse } from './responses/skill.response';
import { SkillRepository } from 'src/user/domain/repositories/skill.repository';
import { SkillResponseMapper } from '../mappers/skill.mapper';
import { SearchSkillsRequest } from './requests/search-skill.request';

export class SearchSkillsQuery implements Query<
  SearchSkillsRequest,
  Promise<SkillResponse[] | null>
> {
  constructor(private readonly skillRepository: SkillRepository) {}

  async execute({
    name,
  }: SearchSkillsRequest): Promise<SkillResponse[] | null> {
    const found = await this.skillRepository.findByName(name);

    if (found) {
      return SkillResponseMapper.toResponseList(found);
    }

    return null;
  }
}
