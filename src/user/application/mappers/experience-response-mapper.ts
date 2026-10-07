import { Experience } from 'src/user/domain/entities/experience.entity';
import { ExperienceResponse } from '../queries/experience/responses/experience.response';

export class ExperienceResponseMapper {
  static toResponse(experience: Experience): ExperienceResponse {
    return {
      id: experience.id,
      type: experience.type,
      title: experience.title,
      institutionOrCompany: experience.institutionOrCompany,
      description: experience.description,
      startYear: experience.startYear,
      endYear: experience.endYear,
      isCurrent: experience.isCurrent,
    };
  }

  static toResponseList(experiences: Experience[]): ExperienceResponse[] {
    return experiences.map((experience) => this.toResponse(experience));
  }
}
