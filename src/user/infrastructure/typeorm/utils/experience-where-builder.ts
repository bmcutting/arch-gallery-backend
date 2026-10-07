import { BaseWhereBuilder } from 'src/shared/infrastructure/typeorm/utils/base-where-builder';
import { FindOptionsWhere } from 'typeorm';
import { WhereUtils } from 'src/shared/infrastructure/typeorm/utils/where-utils';
import { ExperienceModel } from '../models/experience.model';
import { ExperiencePaginationParams } from 'src/user/domain/interfaces/experience-pagination';

export class ExperienceWhereBuilder extends BaseWhereBuilder<
  ExperienceModel,
  ExperiencePaginationParams
> {
  protected buildWhereConditions(
    where: FindOptionsWhere<ExperienceModel>,
    filters: ExperiencePaginationParams,
  ): FindOptionsWhere<ExperienceModel> {
    where.user_id = filters.userId;
    where.type = WhereUtils.assignIfExists(filters.type);
    return where;
  }
}
