import { Project } from '../entities/project.entity';
import { ProjectPaginationParams } from '../interfaces/project-pagination';
import { PaginationResult } from 'src/shared/domain/interfaces/pagination-result';

export interface ProjectRepository {
  create(props: CreateProjectProps): Promise<string>;
  findById(id: string): Promise<Project | null>;
  findAll(props: ProjectPaginationParams): Promise<PaginationResult<Project>>;
  update(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
  findByUserId(id: string): Promise<Project[]>;
  getProjectFeed(cursor?: string, limit?: number): Promise<Project[]>;
  ///likes
  addLike(userId: string, projectId: string): Promise<void>;
  removeLike(userId: string, projectId: string): Promise<void>;
  countLikes(projectId: string): Promise<number>;
}

export interface CreateProjectProps {
  title: string;
  description?: string;
  year: number;
  userId: string;
}
