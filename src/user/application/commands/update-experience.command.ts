import { Command } from 'src/shared/interfaces/command.interface';
import { UpdateExperienceRequest } from './requests/update-experience.request';
import { UpdateExperienceResponse } from './responses/update-experience.response';
import { ExperienceRepository } from 'src/user/domain/repositories/experience.repository';
import { NotFoundExperienceException } from 'src/user/domain/exceptions/experience';
import { UpdateExperience } from 'src/user/domain/services/experience-update';

interface UpdateExperienceProps {
  request: UpdateExperienceRequest;
}

export class UpdateExperienceCommand implements Command<
  UpdateExperienceProps,
  UpdateExperienceResponse
> {
  constructor(
    private readonly experienceRepository: ExperienceRepository,
    private readonly updateExperienceService: UpdateExperience,
  ) {}

  async execute(
    props: UpdateExperienceProps,
  ): Promise<UpdateExperienceResponse> {
    const experience = await this.experienceRepository.findById(
      props.request.experienceId,
    );
    if (!experience) {
      throw new NotFoundExperienceException();
    }

    await this.updateExperienceService.execute(experience, {
      type: experience.type,
      title: experience.title,
      institutionOrCompany: experience.institutionOrCompany,
      startYear: experience.startYear,
      description: experience.description,
      endYear: experience.endYear,
      isCurrent: experience.isCurrent,
    });

    return { success: true };
  }
}
