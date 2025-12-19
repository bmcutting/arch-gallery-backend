import { InjectRepository } from '@nestjs/typeorm';
import {
  CategoryRepository,
  CreateCategoryProps,
} from 'src/category/domain/repositories/category.repository';
import { CategoryModel } from '../models/category';
import { Repository } from 'typeorm';
import { Category } from 'src/category/domain/entities/category';
import { CategoryPaginationParams } from 'src/category/domain/interfaces/category-pagination';
import { PaginationResult } from 'src/shared/domain/interfaces/pagination-result';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { NotFoundProjectException } from 'src/project/domain/exceptions/project';
import { CategoryTypeOrmMapper } from '../mappers/category.mapper';
import { NotFoundCategoryException } from 'src/category/domain/exceptions/category';
import { CategoryWhereBuilder } from '../utils/category-where-builder';
import { CategoryOrderBuilder } from '../utils/category-order-builder';
import {
  getPaginationInfo,
  getPaginationOptions,
} from 'src/shared/utils/pagination.util';

export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryModel)
    private readonly categoryRepository: Repository<CategoryModel>,
    @InjectRepository(ProjectModel)
    private readonly projectRepository: Repository<ProjectModel>,
  ) {}

  async create(props: CreateCategoryProps): Promise<string> {
    const project = await this.projectRepository.findOne({
      where: { id: props.projectId },
      relations: { categories: true },
    });
    if (!project) {
      throw new NotFoundProjectException();
    }

    let category = await this.categoryRepository.findOneBy({
      name: props.name,
    });

    if (category) {
      const alreadyLinked = project.categories.some(
        (c) => c.id === category?.id,
      );
      if (!alreadyLinked) {
        project.categories.push(category);
        await this.projectRepository.save(project);
      }
      return category.id;
    }

    category = this.categoryRepository.create({ name: props.name.trim() });
    await this.categoryRepository.save(category);
    project.categories.push(category);
    await this.projectRepository.save(project);
    return category.id;
  }

  async findById(id: string): Promise<Category | null> {
    const found = await this.categoryRepository.findOne({
      where: { id },
    });

    return found ? CategoryTypeOrmMapper.execute(found) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const found = await this.categoryRepository.findOne({
      where: { name },
    });

    return found ? CategoryTypeOrmMapper.execute(found) : null;
  }

  async findAll(
    props: CategoryPaginationParams,
  ): Promise<PaginationResult<Category>> {
    const where = CategoryWhereBuilder.build(props);
    const order = CategoryOrderBuilder.build(props.sort);
    const { skip, take } = getPaginationOptions(props);

    const [items, totalItems] = await this.categoryRepository.findAndCount({
      where,
      order,
      skip,
      take,
    });

    const pagination = getPaginationInfo(totalItems, props);

    return {
      items: items.map((u) => CategoryTypeOrmMapper.execute(u)),
      totalItems,
      pagination,
    };
  }

  async update(category: Category): Promise<void> {
    const existing = await this.categoryRepository.findOne({
      where: { name: category.name },
    });
    if (!existing) {
      await this.categoryRepository.update(category.id, {
        createdAt: category.createdAt,
        name: category.name,
      });
    }
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.update(id, {
      isActive: false,
      deletedAt: new Date(),
    });
  }

  async addCategory(projectId: string, categoryId: string): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: {
        categories: true,
      },
    });
    if (!project) {
      throw new NotFoundProjectException();
    }

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: {
        projects: true,
      },
    });
    if (!category) {
      throw new NotFoundCategoryException();
    }

    const alreadyLinked = project.categories.some((c) => c.id === category.id);
    if (!alreadyLinked) {
      project.categories.push(category);
      await this.projectRepository.save(project);
    }
  }

  async removeCategory(projectId: string, categoryId: string): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id: categoryId },
      relations: {
        categories: true,
      },
    });
    if (!project) {
      throw new NotFoundProjectException();
    }
    project.categories = project.categories.filter((c) => c.id !== categoryId);
    await this.projectRepository.save(project);
  }
}
