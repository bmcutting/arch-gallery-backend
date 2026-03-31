import { UserRepository } from '../repositories/user.repository';
import { NotFoundUserException } from '../exceptions/user';
import { SkillRepository } from '../repositories/skill.repository';
import { Level } from '../enums/level';

export interface CreateSkillProps {
  userId: string;
  name: string;
  level?: Level;
}

export class SkillCreator {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly skillRepository: SkillRepository,
  ) {}

  async execute(props: CreateSkillProps) {
    const existingUser = await this.userRepository.findById(props.userId);
    if (!existingUser) {
      throw new NotFoundUserException();
    }

    const userId = await this.skillRepository.create({
      userId: props.userId,
      name: props.name,
      level: props.level,
    });

    return userId;
  }
}
