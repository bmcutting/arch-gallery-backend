import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserProps,
  UserRepository,
} from 'src/user/domain/repositories/user.repository';
import { UserModel } from '../models/user';
import { Repository } from 'typeorm';
import { PaginationResult } from 'src/shared/domain/interfaces/pagination-result';
import { User } from 'src/user/domain/entities/user.entity';
import { UserPaginationParams } from 'src/user/domain/interfaces/user-pagination';
import { UserTypeOrmMapper } from '../mappers/user-mapper';
import {
  getPaginationInfo,
  getPaginationOptions,
} from 'src/shared/utils/pagination.util';
import { UserWhereBuilder } from '../utils/user-where-builder';
import { UserOrderBuilder } from '../utils/user-order-builder';
import { NotFoundUserException } from 'src/user/domain/exceptions/user';
import { SkillTypeOrmMapper } from '../mappers/skill-mapper';
import { ExperienceTypeOrmMapper } from '../mappers/experience-mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async create(props: CreateUserProps): Promise<string> {
    const user = new UserModel();
    user.userName = props.userName;
    user.password = props.password;
    user.email = props.email;
    user.firstName = props.firtsName;
    user.lastName = props.lastName;

    await this.userRepository.save(user);

    return user.id;
  }

  async findById(id: string): Promise<User | null> {
    const found = await this.userRepository.findOne({
      where: { id },
      relations: ['skills', 'experiences'],
    });
    return found ? UserTypeOrmMapper.execute(found) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.userRepository.findOne({
      where: { email },
      relations: ['skills', 'experiences'],
    });
    return found ? UserTypeOrmMapper.execute(found) : null;
  }

  async findByUserName(userName: string): Promise<User | null> {
    const found = await this.userRepository.findOne({
      where: { userName },
      relations: ['skills', 'experiences'],
    });
    return found ? UserTypeOrmMapper.execute(found) : null;
  }

  async findAll(props: UserPaginationParams): Promise<PaginationResult<User>> {
    const where = UserWhereBuilder.build(props);
    const order = UserOrderBuilder.build(props.sort);
    const { skip, take } = getPaginationOptions(props);

    const [items, totalItems] = await this.userRepository.findAndCount({
      where,
      order,
      skip,
      take,
    });

    const pagination = getPaginationInfo(totalItems, props);

    return {
      items: items.map((u) => UserTypeOrmMapper.execute(u)),
      totalItems,
      pagination,
    };
  }

  async update(user: User): Promise<void> {
    const userModel = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['skills', 'experiences'],
    });

    if (!userModel) {
      throw new NotFoundUserException();
    }

    userModel.id = user.id;
    userModel.createdAt = user.createdAt;
    userModel.email = user.email;
    userModel.userName = user.userName;
    userModel.firstName = user.firstName;
    userModel.lastName = user.lastName;
    userModel.phoneNumber = user.phoneNumber;
    userModel.longBio = user.longBio;
    userModel.shortBio = user.shortBio;
    userModel.profileImageUrl = user.profileImageUrl;
    userModel.coverImageUrl = user.coverImageUrl;
    userModel.website = user.website;
    userModel.location = user.location;
    userModel.experienceYears = user.experienceYears;
    userModel.specialization = user.specialization;
    userModel.instagramUrl = user.instagramUrl;
    userModel.twitterUrl = user.twitterUrl;
    userModel.linkedinUrl = user.linkedinUrl;
    userModel.languages = user.languages;
    userModel.skills = SkillTypeOrmMapper.toModelList(user.skills);
    userModel.experiences = ExperienceTypeOrmMapper.toModelList(
      user.experiences,
    );
    userModel.isActive = user.isActive;
    userModel.deletedAt = user.deletedAt;

    await this.userRepository.save(userModel);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.update(id, {
      isActive: false,
      deletedAt: new Date(),
    });
  }
}
