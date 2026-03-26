import { Experience } from 'src/user/domain/entities/experience.entity';
import { ExperienceResponse } from '../queries/responses/experience.response';

export class ExperienceResponseMapper {
  static toResponse(experience: Experience): ExperienceResponse {
    return {
      id: experience.id,
      type: experience.type,
      title: experience.title,
      institutionOrCompany: experience.institutionOrCompany,
      description: experience.description ?? undefined,
      startYear: experience.startYear,
      endYear: experience.endYear ?? undefined,
      isCurrent: experience.isCurrent,
    };
  }

  static toResponseList(experiences: Experience[]): ExperienceResponse[] {
    return experiences.map((experience) => this.toResponse(experience));
  }
}
