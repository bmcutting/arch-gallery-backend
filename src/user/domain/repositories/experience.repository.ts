import { Experience } from '../entities/experience.entity';
import { ExperienceType } from '../enums/experience';

export interface ExperienceRepository {
  create(props: CreateExperienceProps): Promise<string>;
  findById(id: string): Promise<Experience | null>;
  findAll(userId: string): Promise<Experience[]>;
  update(skill: Experience): Promise<string>;
  delete(id: string): Promise<void>;
}

export interface CreateExperienceProps {
  userId: string;
  type: ExperienceType;
  title: string;
  institutionOrCompany: string;
  startYear: number;
  description?: string;
  endYear?: number;
  isCurrent?: boolean;
}
