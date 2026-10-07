import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { BaseTypeOrmRepository } from 'src/shared/infrastructure/typeorm/repositories/base-typeorm.repository';
import { TypeOrmUnitOfWork } from 'src/shared/infrastructure/typeorm/services/typeorm-unit-of-work';
import { UserSkill } from 'src/user/domain/entities/user-skill.entity';
import { UserSkillRepository } from 'src/user/domain/repositories/user-skill.repository';
import { UserSkillModel } from '../models/user-skill.model';
import { UserSkillTypeOrmMapper } from '../mappers/user-skill-mapper';
import { UserSkillRelationsBuilder } from '../relations/user-skill-relations-builder';
import { UserSkillWhereBuilder } from '../utils/user-skill-where-builder';
import { UserSkillOrderBuilder } from '../utils/user-skill-order-builder';
import { UserSkillPaginationParams } from 'src/user/domain/interfaces/user-skill-pagination';
import { PaginationResult } from 'src/shared/domain/interfaces/pagination';
import {
  getPaginationInfo,
  getPaginationOptions,
} from 'src/shared/infrastructure/utils/pagination.util';

@Injectable()
export class TypeOrmUserSkillRepository
  extends BaseTypeOrmRepository<UserSkillModel>
  implements UserSkillRepository
{
  constructor(dataSource: DataSource, unitOfWork: TypeOrmUnitOfWork) {
    super(dataSource, unitOfWork, UserSkillModel);
  }

  async saveMultiple(userSkills: UserSkill[]): Promise<void> {
    if (userSkills.length === 0) return;
    await this.repository.save(UserSkillTypeOrmMapper.toModelList(userSkills));
  }

  async findByUserId(userId: string): Promise<UserSkill[]> {
    const items = await this.repository.find({
      // Sin filtro de isActive: la tabla se borra en duro, y el diff tiene que ver todas.
      where: { user_id: userId },
      relations: UserSkillRelationsBuilder.build(),
    });

    return UserSkillTypeOrmMapper.toDomainList(items);
  }

  async update(userSkill: UserSkill): Promise<void> {
    await this.repository.update(
      { id: userSkill.getId() },
      { level: userSkill.getLevel() },
    );
  }

  async find(
    props: UserSkillPaginationParams,
  ): Promise<PaginationResult<UserSkill>> {
    const where = UserSkillWhereBuilder.build(props);
    const order = UserSkillOrderBuilder.build(props.sort);
    const { skip, take } = getPaginationOptions(props);

    const [items, totalItems] = await this.repository.findAndCount({
      where,
      order,
      skip,
      take,
      relations: UserSkillRelationsBuilder.build(),
    });

    return {
      items: UserSkillTypeOrmMapper.toDomainList(items),
      totalItems,
      pagination: getPaginationInfo(totalItems, props),
    };
  }

  async deleteByIds(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await this.repository.delete({ id: In(ids) });
  }

  async deleteBySkillId(skillId: string): Promise<void> {
    await this.repository.delete({ skill_id: skillId });
  }
}
