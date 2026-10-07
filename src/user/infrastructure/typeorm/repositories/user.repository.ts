import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseTypeOrmRepository } from 'src/shared/infrastructure/typeorm/repositories/base-typeorm.repository';
import { TypeOrmUnitOfWork } from 'src/shared/infrastructure/typeorm/services/typeorm-unit-of-work';
import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { UserModel } from '../models/user.model';
import { PaginationResult } from 'src/shared/domain/interfaces/pagination';
import { User } from 'src/user/domain/entities/user.entity';
import { UserPaginationParams } from 'src/user/domain/interfaces/user-pagination';
import { UserTypeOrmMapper } from '../mappers/user-mapper';
import {
  getPaginationInfo,
  getPaginationOptions,
} from 'src/shared/infrastructure/utils/pagination.util';
import { UserWhereBuilder } from '../utils/user-where-builder';
import { UserOrderBuilder } from '../utils/user-order-builder';
import { UserRelationsBuilder } from '../relations/user-relations-builder';

@Injectable()
export class TypeOrmUserRepository
  extends BaseTypeOrmRepository<UserModel>
  implements UserRepository
{
  constructor(dataSource: DataSource, unitOfWork: TypeOrmUnitOfWork) {
    super(dataSource, unitOfWork, UserModel);
  }

  async save(user: User): Promise<void> {
    await this.repository.save(UserTypeOrmMapper.toModel(user));
  }

  async findById(id: string): Promise<User | null> {
    const found = await this.repository.findOne({
      where: { id, isActive: true },
      relations: UserRelationsBuilder.build(),
    });
    return found ? UserTypeOrmMapper.execute(found) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.repository.findOne({
      where: { email, isActive: true },
      relations: UserRelationsBuilder.buildWithoutRelations(),
    });
    return found ? UserTypeOrmMapper.execute(found) : null;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const found = await this.repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .andWhere('user.isActive = true')
      .getOne();

    return found ? UserTypeOrmMapper.execute(found) : null;
  }

  // Cambiar la contrasena exige comparar la actual, y `select: false` la oculta.
  async findByIdWithPassword(id: string): Promise<User | null> {
    const found = await this.repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .andWhere('user.isActive = true')
      .getOne();

    return found ? UserTypeOrmMapper.execute(found) : null;
  }

  async findByUserName(userName: string): Promise<User | null> {
    const found = await this.repository.findOne({
      where: { userName, isActive: true },
      relations: UserRelationsBuilder.buildWithoutRelations(),
    });
    return found ? UserTypeOrmMapper.execute(found) : null;
  }

  async findAll(props: UserPaginationParams): Promise<PaginationResult<User>> {
    const where = UserWhereBuilder.build(props);
    const order = UserOrderBuilder.build(props.sort);
    const { skip, take } = getPaginationOptions(props);

    const [items, totalItems] = await this.repository.findAndCount({
      where,
      order,
      skip,
      take,
    });

    return {
      items: items.map((u) => UserTypeOrmMapper.execute(u)),
      totalItems,
      pagination: getPaginationInfo(totalItems, props),
    };
  }

  // Solo los campos editables: ni `password`, ni las skills y experiencias, que las escriben
  // sus propios repositorios.
  async update(user: User): Promise<void> {
    await this.repository.update(
      { id: user.getId() },
      {
        email: user.email,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        shortBio: user.shortBio,
        longBio: user.longBio,
        profileImageUrl: user.profileImageUrl,
        coverImageUrl: user.coverImageUrl,
        website: user.website,
        location: user.location,
        experienceYears: user.experienceYears,
        specialization: user.specialization,
        instagramUrl: user.instagramUrl,
        twitterUrl: user.twitterUrl,
        linkedinUrl: user.linkedinUrl,
        languages: user.languages,
        isActive: user.isActive,
        deletedAt: user.deletedAt,
      },
    );
  }

  // Aparte de `update` a proposito: cambiar la contrasena tiene sus propias reglas, y en el
  // camino de un update de perfil `password` viene `undefined` por el `select: false`.
  async updatePassword(user: User): Promise<void> {
    await this.repository.update(
      { id: user.getId() },
      { password: user.password },
    );
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, {
      isActive: false,
      deletedAt: new Date(),
    });
  }
}
