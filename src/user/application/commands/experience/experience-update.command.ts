import { Command } from 'src/shared/application/interfaces/command.interface';
import { ensureResourceOwner } from 'src/authorization/domain/services/ensure-resource-owner';
import { NotFoundExperienceException } from 'src/user/domain/exceptions/experience';
import { ExperienceRepository } from 'src/user/domain/repositories/experience.repository';
import { UpdateExperience } from 'src/user/domain/services/experience/experience-update';
import { ExperienceResponse } from '../../queries/experience/responses/experience.response';
import { ExperienceResponseMapper } from '../../mappers/experience-response-mapper';
import { ExperienceUpdateRequest } from './requests/experience-update.request';

interface Props {
  request: ExperienceUpdateRequest;
  id: string;
  currentUserId: string;
}

export class ExperienceUpdateCommand implements Command<
  Props,
  ExperienceResponse
> {
  constructor(
    private readonly experienceRepository: ExperienceRepository,
    private readonly service: UpdateExperience,
  ) {}

  async execute({
    request,
    id,
    currentUserId,
  }: Props): Promise<ExperienceResponse> {
    const experience = await this.experienceRepository.findById(id);

    if (!experience) throw new NotFoundExperienceException();

    ensureResourceOwner({
      ownerId: experience.getUserId(),
      userId: currentUserId,
    });

    const updated = await this.service.execute({
      id: experience.getId(),
      experience,
      type: request.type,
      title: request.title,
      institutionOrCompany: request.institutionOrCompany,
      startYear: request.startYear,
      endYear: request.endYear,
      description: request.description,
      isCurrent: request.isCurrent,
    });

    return ExperienceResponseMapper.toResponse(updated);
  }
}
