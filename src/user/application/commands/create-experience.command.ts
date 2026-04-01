import { Command } from 'src/shared/interfaces/command.interface';
import { CreateExperienceRequest } from './requests/create-experience.request';
import { CreateExperienceResponse } from './responses/create-experience.response';
import { ExperienceCreator } from 'src/user/domain/services/experience-create';

export class CreateExperienceCommand implements Command<
  CreateExperienceRequest,
  CreateExperienceResponse
> {
  constructor(private readonly createExperienceService: ExperienceCreator) {}

  async execute(
    props: CreateExperienceRequest,
  ): Promise<CreateExperienceResponse> {
    const experienceId = await this.createExperienceService.execute({
      type: props.type,
      title: props.title,
      institutionOrCompany: props.institutionOrCompany,
      startYear: props.startYear,
      description: props.description,
      endYear: props.endYear,
      isCurrent: props.isCurrent,
      userId: props.userId,
    });

    return { id: experienceId };
  }
}
