import { ProjectRepository } from 'src/project/domain/repositories/user.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { NotFoundProjectException } from 'src/project/domain/exceptions/project';

export interface CreateCategoryProps {
  name: string;
  projectId: string;
}

export class CategoryCreator {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(props: CreateCategoryProps) {
    const project = await this.projectRepository.findById(props.projectId);
    if (!project) {
      throw new NotFoundProjectException();
    }

    const categoryId = await this.categoryRepository.create({
      name: props.name,
      projectId: props.projectId,
    });

    return categoryId;
  }
}
