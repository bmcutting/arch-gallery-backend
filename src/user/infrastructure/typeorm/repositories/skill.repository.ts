import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseTypeOrmRepository } from 'src/shared/infrastructure/typeorm/repositories/base-typeorm.repository';
import { TypeOrmUnitOfWork } from 'src/shared/infrastructure/typeorm/services/typeorm-unit-of-work';
import {
  getPaginationInfo,
  getPaginationOptions,
} from 'src/shared/infrastructure/utils/pagination.util';
import { PaginationResult } from 'src/shared/domain/interfaces/pagination';
import { Skill } from 'src/user/domain/entities/skill.entity';
import { SkillScope } from 'src/user/domain/enums/skill-scope';
import { SkillPaginationParams } from 'src/user/domain/interfaces/skill-pagination';
import { SkillRepository } from 'src/user/domain/repositories/skill.repository';
import { SkillModel } from '../models/skill.model';
import { SkillTypeOrmMapper } from '../mappers/skill-mapper';
import { SkillRelationsBuilder } from '../relations/skill-relations-builder';
import { SkillWhereBuilder } from '../utils/skill-where-builder';
import { SkillOrderBuilder } from '../utils/skill-order-builder';

@Injectable()
export class TypeOrmSkillRepository
  extends BaseTypeOrmRepository<SkillModel>
  implements SkillRepository
{
  constructor(dataSource: DataSource, unitOfWork: TypeOrmUnitOfWork) {
    super(dataSource, unitOfWork, SkillModel);
  }

  async save(skill: Skill): Promise<void> {
    await this.repository.save(SkillTypeOrmMapper.toModel(skill));
  }

  async update(skill: Skill): Promise<void> {
    await this.repository.update(
      { id: skill.getId() },
      {
        displayName: skill.getDisplayName(),
        normalizedName: skill.getNormalizedName(),
        scope: skill.getScope(),
        isActive: skill.getIsActive(),
        deletedAt: skill.getDeletedAt(),
      },
    );
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, {
      isActive: false,
      deletedAt: new Date(),
    });
  }

  async findById(id: string): Promise<Skill | null> {
    const found = await this.repository.findOne({
      where: { id },
      relations: SkillRelationsBuilder.build(),
    });

    return found ? SkillTypeOrmMapper.toDomain(found) : null;
  }

  async findByNormalizedName(
    normalizedName: string,
    scope: SkillScope,
    createdById?: string,
  ): Promise<Skill | null> {
    const found = await this.repository.findOne({
      where: {
        normalizedName,
        scope,
        ...(createdById ? { created_by_id: createdById } : {}),
      },
      relations: SkillRelationsBuilder.build(),
    });

    return found ? SkillTypeOrmMapper.toDomain(found) : null;
  }

  async find(props: SkillPaginationParams): Promise<PaginationResult<Skill>> {
    // Aqui la visibilidad si va en SQL: una pagina no se puede filtrar en memoria.
    const where = SkillWhereBuilder.build(props);
    const order = SkillOrderBuilder.build(props.sort);
    const { skip, take } = getPaginationOptions(props);

    const [items, totalItems] = await this.repository.findAndCount({
      where,
      order,
      skip,
      take,
      relations: SkillRelationsBuilder.build(),
    });

    return {
      items: SkillTypeOrmMapper.toDomainList(items),
      totalItems,
      pagination: getPaginationInfo(totalItems, props),
    };
  }
}
