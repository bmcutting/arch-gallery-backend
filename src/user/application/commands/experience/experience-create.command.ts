import { Command } from 'src/shared/application/interfaces/command.interface';
import { ExperienceCreate } from 'src/user/domain/services/experience/experience-create';
import { ExperienceResponse } from '../../queries/experience/responses/experience.response';
import { ExperienceResponseMapper } from '../../mappers/experience-response-mapper';
import { ExperienceCreateRequest } from './requests/experience-create.request';

interface Props {
  request: ExperienceCreateRequest;
  currentUserId: string;
}

export class ExperienceCreateCommand implements Command<
  Props,
  ExperienceResponse
> {
  constructor(private readonly service: ExperienceCreate) {}

  async execute({
    request,
    currentUserId,
  }: Props): Promise<ExperienceResponse> {
    const experience = await this.service.execute({
      userId: currentUserId,
      type: request.type,
      title: request.title,
      institutionOrCompany: request.institutionOrCompany,
      startYear: request.startYear,
      endYear: request.endYear,
      description: request.description,
      isCurrent: request.isCurrent,
    });

    return ExperienceResponseMapper.toResponse(experience);
  }
}
