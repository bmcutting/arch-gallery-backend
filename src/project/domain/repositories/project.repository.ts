import { Project } from '../entities/project.entity';
import { ProjectPaginationParams } from '../interfaces/project-pagination';
import { PaginationResult } from 'src/shared/domain/interfaces/pagination-result';

export interface ProjectRepository {
  create(props: CreateProjectProps): Promise<string>;
  findById(id: string): Promise<Project | null>;
  findAll(props: ProjectPaginationParams): Promise<PaginationResult<Project>>;
  update(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
  ///likes
  addLike(userId: string, projectId: string): Promise<void>;
  removeLike(userId: string, projectId: string): Promise<void>;
  countLikes(projectId: string): Promise<number>;

  // --- Comments ---
  addComment(userId: string, projectId: string, text: string): Promise<void>;
  removeComment(commentId: string): Promise<void>;
  countComments(projectId: string): Promise<number>;
}

export interface CreateProjectProps {
  title: string;
  description?: string;
  userId: string;
}
