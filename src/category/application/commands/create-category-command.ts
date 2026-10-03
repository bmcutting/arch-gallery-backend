import { Command } from 'src/shared/application/interfaces/command.interface';
import { CategoryCreator } from 'src/category/domain/services/category-create';
import { ProjectRepository } from 'src/project/domain/repositories/project.repository';
import { NotFoundProjectException } from 'src/project/domain/exceptions/project';
import { ensureResourceOwner } from 'src/authorization/domain/services/ensure-resource-owner';
import { CreateCategoryRequest } from './requests/create-category.request';
import { CreateCategoryResponse } from './responses/create-category.response';

interface Props {
  request: CreateCategoryRequest;
  currentUserId: string;
}

export class CreateCategoryCommand implements Command<
  Props,
  CreateCategoryResponse
> {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly createCategoryService: CategoryCreator,
  ) {}

  async execute({
    request,
    currentUserId,
  }: Props): Promise<CreateCategoryResponse> {
    // El servicio vuelve a cargar el proyecto para comprobar que existe. La
    // Fase 6 colapsa las dos cargas al reestructurar el modulo.
    const project = await this.projectRepository.findById(request.projectId);
    if (!project) {
      throw new NotFoundProjectException();
    }

    ensureResourceOwner({
      ownerId: project.getUser().getId(),
      userId: currentUserId,
    });

    const categoryId = await this.createCategoryService.execute({
      name: request.name,
      projectId: request.projectId,
    });

    return { id: categoryId };
  }
}
