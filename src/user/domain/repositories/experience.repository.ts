import { PaginationResult } from 'src/shared/domain/interfaces/pagination';
import { Experience } from '../entities/experience.entity';
import { ExperiencePaginationParams } from '../interfaces/experience-pagination';

export interface ExperienceRepository {
  save(experience: Experience): Promise<void>;
  update(experience: Experience): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Experience | null>;
  find(
    props: ExperiencePaginationParams,
  ): Promise<PaginationResult<Experience>>;
}
