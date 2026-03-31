import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillModel } from '../models/skill';
import { Repository } from 'typeorm';
import { UserModel } from '../models/user';
import {
  CreateSkillProps,
  SkillRepository,
} from 'src/user/domain/repositories/skill.repository';
import { Skill } from 'src/user/domain/entities/skill.entity';
import { SkillTypeOrmMapper } from '../mappers/skill-mapper';
import { NotFoundUserException } from 'src/user/domain/exceptions/user';
import { NotFoundSkillException } from 'src/user/domain/exceptions/skill';

@Injectable()
export class TypeOrmSkillRepository implements SkillRepository {
  constructor(
    @InjectRepository(SkillModel)
    private readonly skillRepository: Repository<SkillModel>,
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async create(props: CreateSkillProps): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: props.userId },
      relations: { skills: true },
    });
    if (!user) {
      throw new NotFoundUserException();
    }

    const skill = await this.skillRepository.findOneBy({
      name: props.name,
    });

    if (skill) {
      const alreadyLinked = user.skills.some((c) => c.id === skill?.id);
      if (!alreadyLinked) {
        user.skills.push(skill);
        await this.userRepository.save(user);
      }
      return true;
    }

    const newSkill = new SkillModel();
    newSkill.name = props.name;
    newSkill.level = props.level ?? null;

    await this.skillRepository.save(newSkill);
    user.skills.push(newSkill);
    await this.userRepository.save(user);

    return true;
  }

  async findById(id: string): Promise<Skill | null> {
    const found = await this.skillRepository.findOne({
      where: { id },
    });

    return found ? SkillTypeOrmMapper.toDomain(found) : null;
  }

  async findByName(name: string): Promise<Skill | null> {
    const found = await this.skillRepository.findOne({
      where: { name },
      relations: ['skills', 'experiences'],
    });

    return found ? SkillTypeOrmMapper.toDomain(found) : null;
  }

  async findAll(userId: string): Promise<Skill[]> {
    const items = await this.skillRepository.find({
      where: { user: { id: userId } },
    });

    return SkillTypeOrmMapper.toDomainList(items);
  }

  async update(skill: Skill): Promise<string> {
    const existing = await this.skillRepository.findOne({
      where: { id: skill.id },
    });

    if (!existing) {
      throw new NotFoundSkillException();
    }

    await this.skillRepository.update(skill.id, {
      name: skill.name,
      level: skill.level,
      updatedAt: new Date(),
    });

    return skill.id;
  }

  async delete(id: string): Promise<void> {
    await this.skillRepository.update(id, {
      isActive: false,
      deletedAt: new Date(),
    });
  }
}
