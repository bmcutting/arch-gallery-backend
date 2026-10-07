import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseTypeOrmRepository } from 'src/shared/infrastructure/typeorm/repositories/base-typeorm.repository';
import { TypeOrmUnitOfWork } from 'src/shared/infrastructure/typeorm/services/typeorm-unit-of-work';
import {
  getPaginationInfo,
  getPaginationOptions,
} from 'src/shared/infrastructure/utils/pagination.util';
import { PaginationResult } from 'src/shared/domain/interfaces/pagination';
import { Experience } from 'src/user/domain/entities/experience.entity';
import { ExperiencePaginationParams } from 'src/user/domain/interfaces/experience-pagination';
import { ExperienceRepository } from 'src/user/domain/repositories/experience.repository';
import { ExperienceModel } from '../models/experience.model';
import { ExperienceTypeOrmMapper } from '../mappers/experience-mapper';
import { ExperienceOrderBuilder } from '../utils/experience-order-builder';
import { ExperienceWhereBuilder } from '../utils/experience-where-builder';

@Injectable()
export class TypeOrmExperienceRepository
  extends BaseTypeOrmRepository<ExperienceModel>
  implements ExperienceRepository
{
  constructor(dataSource: DataSource, unitOfWork: TypeOrmUnitOfWork) {
    super(dataSource, unitOfWork, ExperienceModel);
  }

  async save(experience: Experience): Promise<void> {
    await this.repository.save(ExperienceTypeOrmMapper.toModel(experience));
  }

  async update(experience: Experience): Promise<void> {
    await this.repository.update(
      { id: experience.getId() },
      {
        type: experience.getType(),
        title: experience.getTitle(),
        institutionOrCompany: experience.getInstitutionOrCompany(),
        startYear: experience.getStartYear(),
        endYear: experience.getEndYear(),
        description: experience.getDescription(),
        isCurrent: experience.getIsCurrent(),
      },
    );
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async findById(id: string): Promise<Experience | null> {
    const found = await this.repository.findOne({ where: { id } });

    return found ? ExperienceTypeOrmMapper.toDomain(found) : null;
  }

  async find(
    props: ExperiencePaginationParams,
  ): Promise<PaginationResult<Experience>> {
    const order = ExperienceOrderBuilder.build(props.sort);
    const { skip, take } = getPaginationOptions(props);

    const [items, totalItems] = await this.repository.findAndCount({
      where: ExperienceWhereBuilder.build(props),
      order,
      skip,
      take,
    });

    return {
      items: ExperienceTypeOrmMapper.toDomainList(items),
      totalItems,
      pagination: getPaginationInfo(totalItems, props),
    };
  }
}
