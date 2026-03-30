import { Experience } from 'src/user/domain/entities/experience.entity';
import { ExperienceModel } from '../models/experience';

export class ExperienceTypeOrmMapper {
  static toDomain(model: ExperienceModel): Experience {
    return new Experience({
      id: model.id,
      type: model.type,
      title: model.title,
      institutionOrCompany: model.institutionOrCompany,
      description: model.description,
      startYear: model.startYear,
      endYear: model.endYear,
      isCurrent: model.isCurrent,
    });
  }

  static toModel(domain: Experience): ExperienceModel {
    const model = new ExperienceModel();
    model.id = domain.getId();
    model.type = domain.getType();
    model.title = domain.getTitle();
    model.institutionOrCompany = domain.getInstitutionOrCompany();
    model.description = domain.getDescription() ?? '';
    model.startYear = domain.getStartYear();
    model.endYear = domain.getEndYear() ?? 0;
    model.isCurrent = domain.getIsCurrent();

    return model;
  }

  static toDomainList(models: ExperienceModel[]): Experience[] {
    return models.map((model) => this.toDomain(model));
  }

  static toModelList(domains: Experience[]): ExperienceModel[] {
    return domains.map((domain) => this.toModel(domain));
  }
}
