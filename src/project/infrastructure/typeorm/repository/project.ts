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
import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category';

export class TypeOrmProjectRepository implements ProjectRepository {
  constructor(
    @InjectRepository(ProjectModel)
    private readonly projectRepository: Repository<ProjectModel>,
    @InjectRepository(CategoryModel)
    private readonly categoryRepository: Repository<CategoryModel>,
  ) {}

  async create(props: CreateProjectProps): Promise<string> {
    const project = new ProjectModel();
    project.title = props.title;
    project.description = props.description ?? '';
    project.year = props.year;
    project.user = { id: props.userId } as UserModel;

    if (props.categories && props.categories.length > 0) {
      const categoryNames = [
        ...new Set(props.categories.map((name) => name.trim())),
      ];

      const categories = await Promise.all(
        categoryNames.map(async (name) => {
          let category = await this.categoryRepository.findOneBy({ name });
          if (!category) {
            category = this.categoryRepository.create({ name });
            await this.categoryRepository.save(category);
          }
          return category;
        }),
      );

      project.categories = categories;
    }

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

  async findByUserId(userId: string): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      where: { user: { id: userId } },
      relations: { user: true, categories: true, comments: true, likes: true },
    });
    return projects.map((project) => ProjectTypeOrmMapper.execute(project));
  }

  async getProjectFeed(
    cursor?: string,
    limit: number = 10,
  ): Promise<Project[]> {
    const query = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.user', 'user')
      .leftJoinAndSelect('project.likes', 'like')
      .leftJoinAndSelect('project.comments', 'comment')
      .leftJoinAndSelect('comment.user', 'commentUser')
      .leftJoinAndSelect('project.categories', 'category')
      .orderBy('project.id', 'DESC')
      .take(limit + 1);

    if (cursor) {
      query.andWhere('project.id < :cursor', {
        cursor: cursor,
      });
    }

    const projects = await query.getMany();

    return projects.map((project) => ProjectTypeOrmMapper.execute(project));
  }
}
