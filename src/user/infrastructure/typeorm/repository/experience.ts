import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExperienceModel } from '../models/experience';
import { Repository } from 'typeorm';
import { UserModel } from '../models/user';
import { ExperienceTypeOrmMapper } from '../mappers/experience-mapper';
import {
  CreateExperienceProps,
  ExperienceRepository,
} from 'src/user/domain/repositories/experience.repository';
import { NotFoundUserException } from 'src/user/domain/exceptions/user';
import { Experience } from 'src/user/domain/entities/experience.entity';
import { NotFoundExperienceException } from 'src/user/domain/exceptions/experience';

@Injectable()
export class TypeOrmExperienceRepository implements ExperienceRepository {
  constructor(
    @InjectRepository(ExperienceModel)
    private readonly experienceRepository: Repository<ExperienceModel>,
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async create(props: CreateExperienceProps): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: props.userId },
    });
    if (!user) {
      throw new NotFoundUserException();
    }

    const experience = new ExperienceModel();
    experience.type = props.type;
    experience.title = props.title;
    experience.institutionOrCompany = props.institutionOrCompany;
    experience.startYear = props.startYear;
    experience.description = props.description ?? null;
    experience.endYear = props.endYear ?? null;
    experience.isCurrent = props.isCurrent ?? false;

    await this.experienceRepository.save(experience);
    user.experiences.push(experience);
    await this.userRepository.save(user);

    return experience.id;
  }

  async findById(id: string): Promise<Experience | null> {
    const found = await this.experienceRepository.findOne({
      where: { id },
    });

    return found ? ExperienceTypeOrmMapper.toDomain(found) : null;
  }

  async findAll(userId: string): Promise<Experience[]> {
    const items = await this.experienceRepository.find({
      where: { user: { id: userId } },
    });

    return ExperienceTypeOrmMapper.toDomainList(items);
  }

  async update(experience: Experience): Promise<string> {
    const existing = await this.experienceRepository.findOne({
      where: { id: experience.id },
    });

    if (!existing) {
      throw new NotFoundExperienceException();
    }

    await this.experienceRepository.update(experience.id, {
      type: experience.type,
      title: experience.title,
      institutionOrCompany: experience.institutionOrCompany,
      startYear: experience.startYear,
      description: experience.description,
      endYear: experience.endYear,
      isCurrent: experience.isCurrent,
      updatedAt: new Date(),
    });

    return experience.id;
  }

  async delete(id: string): Promise<void> {
    await this.experienceRepository.update(id, {
      isActive: false,
      deletedAt: new Date(),
    });
  }
}
