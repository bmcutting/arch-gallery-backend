import { FindOptionsRelations } from 'typeorm';
import { ExperienceModel } from '../models/experience.model';

export class ExperienceRelationsBuilder {
  static build(): FindOptionsRelations<ExperienceModel> {
    return {};
  }
}
