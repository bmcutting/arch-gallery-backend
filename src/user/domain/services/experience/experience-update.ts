import { Experience } from '../../entities/experience.entity';
import { ExperienceType } from '../../enums/experience';
import { NotFoundExperienceException } from '../../exceptions/experience';
import { ExperienceRepository } from '../../repositories/experience.repository';

export interface UpdateExperienceProps {
  id: string;
  experience?: Experience;
  type?: ExperienceType;
  title?: string;
  institutionOrCompany?: string;
  startYear?: number;
  description?: string;
  endYear?: number;
  isCurrent?: boolean;
}

export class UpdateExperience {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async execute(props: UpdateExperienceProps): Promise<Experience> {
    const experience =
      props.experience ?? (await this.experienceRepository.findById(props.id));

    if (!experience) throw new NotFoundExperienceException();

    let hasChanges = false;

    if (props.type !== undefined && props.type !== experience.getType()) {
      experience.setType(props.type);
      hasChanges = true;
    }

    if (props.title !== undefined && props.title !== experience.getTitle()) {
      experience.setTitle(props.title);
      hasChanges = true;
    }

    if (
      props.institutionOrCompany !== undefined &&
      props.institutionOrCompany !== experience.getInstitutionOrCompany()
    ) {
      experience.setInstitutionOrCompany(props.institutionOrCompany);
      hasChanges = true;
    }

    if (
      props.startYear !== undefined &&
      props.startYear !== experience.getStartYear()
    ) {
      experience.setStartYear(props.startYear);
      hasChanges = true;
    }

    if (
      props.description !== undefined &&
      props.description !== experience.getDescription()
    ) {
      experience.setDescription(props.description);
      hasChanges = true;
    }

    if (
      props.endYear !== undefined &&
      props.endYear !== experience.getEndYear()
    ) {
      experience.setEndYear(props.endYear);
      hasChanges = true;
    }

    if (
      props.isCurrent !== undefined &&
      props.isCurrent !== experience.getIsCurrent()
    ) {
      experience.setIsCurrent(props.isCurrent);
      hasChanges = true;
    }

    if (hasChanges) {
      await this.experienceRepository.update(experience);
    }

    return experience;
  }
}
