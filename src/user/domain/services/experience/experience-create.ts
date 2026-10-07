import type IdGenerator from 'src/shared/domain/interfaces/id.generator';
import { Experience } from '../../entities/experience.entity';
import { ExperienceType } from '../../enums/experience';
import { NotFoundUserException } from '../../exceptions/user';
import { ExperienceRepository } from '../../repositories/experience.repository';
import { UserRepository } from '../../repositories/user.repository';

export interface CreateExperienceProps {
  userId: string;
  type: ExperienceType;
  title: string;
  institutionOrCompany: string;
  startYear: number;
  description?: string | null;
  endYear?: number | null;
  isCurrent?: boolean;
}

export class ExperienceCreate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly experienceRepository: ExperienceRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(props: CreateExperienceProps): Promise<Experience> {
    const existingUser = await this.userRepository.findById(props.userId);
    if (!existingUser) {
      throw new NotFoundUserException();
    }

    const experience = new Experience({
      id: this.idGenerator.create(),
      userId: props.userId,
      type: props.type,
      title: props.title,
      institutionOrCompany: props.institutionOrCompany,
      startYear: props.startYear,
      description: props.description ?? null,
      endYear: props.endYear ?? null,
      isCurrent: props.isCurrent ?? false,
    });

    await this.experienceRepository.save(experience);
    return experience;
  }
}
