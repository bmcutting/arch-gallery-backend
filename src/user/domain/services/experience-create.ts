import { ExperienceType } from '../enums/experience';
import { NotFoundUserException } from '../exceptions/user';
import { ExperienceRepository } from '../repositories/experience.repository';
import { UserRepository } from '../repositories/user.repository';

export interface CreateExperienceProps {
  userId: string;
  type: ExperienceType;
  title: string;
  institutionOrCompany: string;
  startYear: number;
  description?: string;
  endYear?: number;
  isCurrent?: boolean;
}

export class ExperienceCreator {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly experienceRepository: ExperienceRepository,
  ) {}

  async execute(props: CreateExperienceProps) {
    const existingUser = await this.userRepository.findById(props.userId);
    if (!existingUser) {
      throw new NotFoundUserException();
    }

    const experienceId = await this.experienceRepository.create({
      userId: props.userId,
      type: props.type,
      title: props.title,
      institutionOrCompany: props.institutionOrCompany,
      startYear: props.startYear,
      description: props.description,
      endYear: props.endYear,
      isCurrent: props.isCurrent,
    });

    return experienceId;
  }
}
