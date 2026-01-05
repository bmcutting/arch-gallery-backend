import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProjectProps,
  ProjectRepository,
} from 'src/project/domain/repositories/project.repository';
import { ProjectModel } from '../models/project';
import { Repository } from 'typeorm';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { Project } from 'src/project/domain/entities/project.entity';
import { ProjectPaginationParams } from 'src/project/domain/interfaces/project-pagination';
import { PaginationResult } from 'src/shared/domain/interfaces/pagination-result';
import { ProjectTypeOrmMapper } from '../mappers/project.mapper';
import { ProjectWhereBuilder } from '../utils/project-where-builder';
import { ProjectOrderBuilder } from '../utils/project-order-builder';
import {
  getPaginationInfo,
  getPaginationOptions,
} from 'src/shared/utils/pagination.util';
import { LikeModel } from '../models/like';
import { CommentModel } from '../models/comment';

export class TypeOrmProjectRepository implements ProjectRepository {
  constructor(
    @InjectRepository(ProjectModel)
    private readonly projectRepository: Repository<ProjectModel>,
    @InjectRepository(LikeModel)
    private readonly likeRepository: Repository<LikeModel>,
    @InjectRepository(CommentModel)
    private readonly commentRepository: Repository<CommentModel>,
  ) {}

  async addLike(userId: string, projectId: string): Promise<void> {
    const like = new LikeModel();
    like.userId = userId;
    like.projectId = projectId;

    await this.likeRepository.save(like);
  }

  async removeLike(userId: string, projectId: string): Promise<void> {
    await this.likeRepository.delete({ userId, projectId });
  }

  async countLikes(projectId: string): Promise<number> {
    const likes = await this.likeRepository.count({
      where: { project: { id: projectId } },
    });
    return likes;
  }

  async addComment(
    userId: string,
    projectId: string,
    text: string,
  ): Promise<void> {
    const comment = new CommentModel();
    comment.project = { id: projectId } as ProjectModel;
    comment.user = { id: userId } as UserModel;
    comment.message = text;

    await this.commentRepository.save(comment);
  }

  async removeComment(commentId: string): Promise<void> {
    await this.commentRepository.delete(commentId);
  }

  async countComments(projectId: string): Promise<number> {
    const comments = await this.commentRepository.count({
      where: { project: { id: projectId } },
    });
    return comments;
  }

  async create(props: CreateProjectProps): Promise<string> {
    const project = new ProjectModel();
    project.title = props.title;
    project.user = { id: props.userId } as UserModel;

    await this.projectRepository.save(project);

    return project.id;
  }

  async findById(id: string): Promise<Project | null> {
    const found = await this.projectRepository.findOne({
      where: { id },
      relations: {
        user: true,
        categories: true,
        comments: true,
        likes: true,
      },
    });

    return found ? ProjectTypeOrmMapper.execute(found) : null;
  }

  async findAll(
    props: ProjectPaginationParams,
  ): Promise<PaginationResult<Project>> {
    const where = ProjectWhereBuilder.build(props);
    const order = ProjectOrderBuilder.build(props.sort);
    const { skip, take } = getPaginationOptions(props);

    const [items, totalItems] = await this.projectRepository.findAndCount({
      where,
      order,
      skip,
      take,
      relations: {
        user: true,
        categories: true,
      },
    });

    const pagination = getPaginationInfo(totalItems, props);

    return {
      items: items.map((u) => ProjectTypeOrmMapper.execute(u)),
      totalItems,
      pagination,
    };
  }

  async update(project: Project): Promise<void> {
    await this.projectRepository.update(project.id, {
      createdAt: project.createdAt,
      title: project.title,
      description: project.description,
    });
  }

  async delete(id: string): Promise<void> {
    await this.projectRepository.update(id, {
      isActive: false,
      deletedAt: new Date(),
    });
  }
}
